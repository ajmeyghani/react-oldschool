const {exec} = require('child_process');
const config = require('../config.json');
const chokidar = require('chokidar');
const glob = require('glob');
const assets = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
].map(v => 'src/**/*' + v);

var watcher = chokidar.watch(assets, {
  ignored: /(^|[\/\\])\../,
  persistent: true
})
.on('all', (event, file) => {
  console.log('File changed:', event, file);
  const filename = file.replace(/[ ]+/g, '_');
  if(event === 'add') {
    exec(`cp ${filename} ${config.bundleFolder}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
    });
  }
  if(event === 'unlink') {
    const toremove = filename.split('/').slice(-1)[0];
    exec(`rm -rf ${config.bundleFolder}/${toremove}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
    });
  }
});
