const path = require('path');
const config = require('../config.json');
const fs = require('fs');
const chokidar = require('chokidar');
const glob = require('glob');
const CleanCSS = new require('clean-css');

const SOURCE = './src/**/*.css';
const OUT_FILE = path.join(config.bundleFolder, config.cssBundle);
const SOURCE_MAP_PATH = `\n/*# sourceMappingURL=${config.cssBundle}.map */`;
const SOURCE_MAP_FILE = path.join(config.bundleFolder, `${config.cssBundle}.map`);

const css = new CleanCSS({
  sourceMap: true,
  rebase: false,
});

var watcher = chokidar.watch('./src/**/*.css', {
  ignored: /(^|[\/\\])\../,
  persistent: true
})
.on('all', (event, file) => {
  console.log('File changed:', event, file);
  glob(SOURCE, (err, files) => {
    css.minify(files, (err, output) => {
      console.log(output.stats);
      fs.writeFile(OUT_FILE, output.styles + SOURCE_MAP_PATH, (err) => {
        if(err) throw new Error('couldnt write the output css.')
      });

      fs.writeFile(SOURCE_MAP_FILE, output.sourceMap.toString(), (err) => {
        if(err) throw new Error('couldnt write the source map for css.')
      });
    });
  });
});
