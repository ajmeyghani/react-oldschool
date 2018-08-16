const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');
const chokidar = require('chokidar');
const config = require('../config.json');
const {getBoundaries, resetScripts, addScript, removeScript} = require('./lib/parser');
const ENTRY_FILE = config.jsEntry;

const start = () => {
  const SOURCE = './src/**/*.js';
  const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');
  const jsLink = (file) => `<script src="/${file.replace('src/', `${config.devJs}/`)}"></script>`;
  let isReady = false;
  let files = [];
  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  exec(`npx babel -w src/ --out-dir ${config.devJs} --source-maps`, (err, stdout, stderr) => {
    if (err) {
      throw new Error(err);
    }
  });

  try {
    fs.writeFileSync(indexFile, resetScripts(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries));
    const watcher = chokidar.watch(SOURCE, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    })
    .on('add', (file) => {
      console.log('file added', file);
      if(isReady) {
        fs.writeFileSync(indexFile, addScript(fs.readFileSync(indexFile, 'utf-8'),
          jsBoundaries, jsLink(file), ~file.search(ENTRY_FILE) ? 'bottom' : 'top'));
      } else {
        files.push(jsLink(file));
      }
    })
    .on('ready', () => {
      console.log('Watching js files ...');
      isReady = true;
      const excludeAppjs = files.filter(f => f.search(ENTRY_FILE) === -1);
      const appjs = files.filter(f => ~f.search(ENTRY_FILE));
      const filesWithApp = excludeAppjs.concat(appjs);
      fs.writeFileSync(indexFile,
        addScript(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries, filesWithApp));
    })
    .on('unlink', (file) => {
      console.log('removed file', file);
      fs.writeFileSync(indexFile,
        removeScript(fs.readFileSync(indexFile, 'utf-8'),
        jsBoundaries, file.replace('src', config.devJs)));
    });
    // .on('addDir', path => log(`Directory ${path} has been added`))
    // .on('unlinkDir', path => log(`Directory ${path} has been removed`));
  } catch(e) {
    throw new Error(e);
  }
};

start();
