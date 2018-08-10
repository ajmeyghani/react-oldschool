const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const glob = require('glob');
const CleanCSS = new require('clean-css');

const OUT_FILE = path.join('./public', 'bundle.css');
const SOURCE = './src/**/*.css';
const css = new CleanCSS();

var watcher = chokidar.watch('./src/**/*.css', {
  ignored: /(^|[\/\\])\../,
  persistent: true
})
.on('all', (event, path) => {
  console.log('File changed:', event, path);
  glob(SOURCE, (err, files) => {
    css.minify(files, (err, output) => {
      console.log(output.stats);
      fs.writeFile(OUT_FILE, output.styles, (err) => {
        if(err) throw new Error('couldnt write the output css.')
      })
    });
  });
});
