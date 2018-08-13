const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const config = require('../config.json');
const {getBoundaries, resetScripts, addScript, removeScript} = require('./lib/parser');
const SOURCE = './src/**/*.css';
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');
const cssLink = (file) => `<link rel="stylesheet" href="/${file}">`;

const start = () => {
  let isReady = false;
  let files = [];
  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
  };

  try {
    fs.writeFileSync(indexFile, resetScripts(fs.readFileSync(indexFile, 'utf-8'), cssBoundaries));
    const watcher = chokidar.watch(SOURCE, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    })
    .on('add', (file) => {
      console.log('file added', file);
      if(isReady) {
        fs.writeFileSync(indexFile,
          addScript(fs.readFileSync(indexFile, 'utf-8'), cssBoundaries, cssLink(file)));
      } else {
        files.push(cssLink(file));
      }
    })
    .on('ready', () => {
      console.log('Watching css files ...');
      isReady = true;
      fs.writeFileSync(indexFile,
        addScript(fs.readFileSync(indexFile, 'utf-8'), cssBoundaries, files));
    })
    .on('unlink', (file) => {
      console.log('removed file', file);
      fs.writeFileSync(indexFile,
        removeScript(fs.readFileSync(indexFile, 'utf-8'), cssBoundaries, file));
    });
    // .on('addDir', path => log(`Directory ${path} has been added`))
    // .on('unlinkDir', path => log(`Directory ${path} has been removed`));
  } catch(e) {
    throw new Error(e);
  }
};

start();
