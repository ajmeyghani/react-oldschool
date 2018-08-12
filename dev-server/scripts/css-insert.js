const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const config = require('../config.json');

const SOURCE = './src/**/*.css';
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');
const cssLink = (file) => `<link rel="stylesheet" href="/${file}">`;

const readWithIndex = (filepath) => {
  const indexFile = filepath;
  const content = fs.readFileSync(indexFile, 'utf-8');
  const lines = content.split('\n');
  let start = 0;
  let end = 0;

  lines.some((v, i) => {
    if(/.*<!\-\-\s*start\s*css\s*\-\->.*/.test(v)) {
      start = i;
      return true;
    }
  });

  lines.some((v, i) => {
    if(/.*<!\-\-\s*end\s*css\s*\-\->.*/.test(v)) {
      end = i;
      return true;
    }
  });

  return {
    start, end, content,
  };
};

const prepare = () => {
  const result = readWithIndex(indexFile);
  const {start, end, content} = result;
  let baseContent = '';
  if(start === end - 1) {
    console.log('nothing need to do.');
    return fs.writeFileSync(indexFile, content);
  } else {
    const lines = content.split('\n');
    const leftHalf = lines.slice(0, start + 1);
    const rightHalf = lines.slice(end, lines.length);
    baseContent = leftHalf.concat(rightHalf).join('\n');
  }
  return fs.writeFileSync(indexFile, baseContent);
};

const add = (newItem) => {
  const result = readWithIndex(indexFile);
  const {start, end, content} = result;
  const lines = content.split('\n');

  const left = lines.slice(0, end);
  const leftPlusNewScript = left.concat(newItem);
  const all = leftPlusNewScript.concat(lines.slice(end, lines.length));

  let newContent =  all.join('\n');
  return fs.writeFileSync(indexFile, newContent);
};

const remove = (toRemove) => {
  const result = readWithIndex(indexFile);
  const {start, end, content} = result;
  const lines = content.split('\n').filter(v => v.search(toRemove) === -1);
  const newContent = lines.join('\n');
  return fs.writeFileSync(indexFile, newContent);
};

const start = () => {
  let isReady = false;
  let files = [];

  prepare();

  const watcher = chokidar.watch(SOURCE, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  })
  .on('add', (file) => {
    console.log('file added', file);
    if(isReady) {
      add(cssLink(file));
    } else {
      files.push(cssLink(file));
    }
  })
  .on('ready', () => {
    console.log('Watching css files ...');
    isReady = true;
    add(files);
  })
  .on('unlink', (file) => {
    console.log('removed file', file);
    remove(file);
  });
  // .on('addDir', path => log(`Directory ${path} has been added`))
  // .on('unlinkDir', path => log(`Directory ${path} has been removed`));
};

start();
