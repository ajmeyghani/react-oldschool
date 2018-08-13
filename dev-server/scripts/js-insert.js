const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');
const chokidar = require('chokidar');
const config = require('../config.json');
const {getBoundaries, resetScripts, addScript, removeScript} = require('./lib/parser');
const SOURCE = './src/**/*.js';
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');
const jsLink = (file) => `<script src="/${file.replace('src/', `${config.devJs}/`)}"></script>`;

const start = () => {
  const outputFile = path.join(config.bundleFolder, config.jsBundle);
  exec(`npx babel -w src/ --out-dir ${config.devJs} --source-maps`, (err, stdout, stderr) => {
    if (err) {
      throw new Error(err);
    }
  });

  let isReady = false;
  let files = [];
  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  try {
    fs.writeFileSync(indexFile, resetScripts(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries));
    const watcher = chokidar.watch(SOURCE, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    })
    .on('add', (file) => {
      console.log('file added', file);
      if(isReady) {
        fs.writeFileSync(indexFile,
          addScript(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries, jsLink(file)));
      } else {
        files.push(jsLink(file));
      }
    })
    .on('ready', () => {
      console.log('Watching js files ...');
      isReady = true;
      fs.writeFileSync(indexFile,
        addScript(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries, files));
    })
    .on('unlink', (file) => {
      console.log('removed file', file);
      fs.writeFileSync(indexFile,
        removeScript(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries, file.replace('src', config.devJs)));
    });
    // .on('addDir', path => log(`Directory ${path} has been added`))
    // .on('unlinkDir', path => log(`Directory ${path} has been removed`));
  } catch(e) {
    throw new Error(e);
  }
};

start();
