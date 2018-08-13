const path = require('path');
const config = require('../config.json');
const fs = require('fs');
const chokidar = require('chokidar');
const glob = require('glob');
const CleanCSS = new require('clean-css');
const {getBoundaries, resetScripts, addScript, removeScript} = require('./lib/parser');
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');

const cssBoundaries = {
  start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
  end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
};
const toAdd = `<link rel="stylesheet" href="/${config.bundleFolder}/${config.cssBundle}">`;

try {
  fs.writeFileSync(indexFile, resetScripts(fs.readFileSync(indexFile, 'utf-8'), cssBoundaries));
  fs.writeFileSync(indexFile,
    addScript(fs.readFileSync(indexFile, 'utf-8'), cssBoundaries, toAdd));
} catch(e) {
  throw new Error(e);
}

const css = new CleanCSS({
  sourceMap: true,
  format: 'beautify',
  rebase: false,
});

const SOURCE = './src/**/*.css';
const OUT_FILE = path.join(config.bundleFolder, config.cssBundle);
const SOURCE_MAP_PATH = `\n/*# sourceMappingURL=${config.cssBundle}.map */`;
const SOURCE_MAP_FILE = path.join(config.bundleFolder, `${config.cssBundle}.map`);

var watcher = chokidar.watch('./src/**/*.css', {
  ignored: /(^|[\/\\])\../,
  persistent: true
})
.on('all', (event, file) => {
  console.log('File changed:', event, file);
  glob(SOURCE, (err, files) => {
    css.minify(files, (err, output) => {

      fs.writeFile(OUT_FILE, output.styles + SOURCE_MAP_PATH, (err) => {
        if(err) throw new Error('couldnt write the output css.')
      });

      const sourceMapsWithPath = (sourceMap) => {
        const mapValues = JSON.parse(sourceMap);
        const newSources = mapValues.sources.map(v => '../' + v);
        return JSON.stringify(Object.assign({}, mapValues, {sources: newSources}));
      };

      fs.writeFile(SOURCE_MAP_FILE, sourceMapsWithPath(output.sourceMap.toString()), (err) => {
        if(err) throw new Error('couldnt write the source map for css.')
      });
    });
  });
});
