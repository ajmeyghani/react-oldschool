const util = require('util');
const fs = require('fs-extra');
const lodash = require('lodash');
const path = require('path');
const {exec} = require('child_process');
const {gzip} = require('node-gzip');
const config = require('../config.json');
const glob = util.promisify(require('glob'));
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const ensureDir = util.promisify(fs.ensureDir);
const execAsync = util.promisify(exec);

const cleanup = () => {
  const remove = `rm -rf ${config.bundleFolder} ${config.buildFolder}`;
  return execAsync(remove);
};

const mkdirs = () => {
  return Promise.all([
    ensureDir(config.bundleFolder),
    ensureDir(config.buildFolder),
  ]);
};

const minifyCss = () => {
  const cssMinPath = path.join(config.buildFolder, config.cssBundle.replace('.css', '.min.css'));
  const bundle = path.join(config.bundleFolder, config.cssBundle);
  return glob('src/**/*.css')
  .then(files => {
    const runCssClean = `npx cleancss -o ${cssMinPath} ${files.join(' ')} --source-map`;
    const singleBundle = `npx cleancss -o ${bundle} ${files.join(' ')} -f beautify --source-map`;
    return Promise.all([
      execAsync(runCssClean),
      execAsync(singleBundle),
    ]);
  })
  .then(() => readFile(cssMinPath, 'utf-8'))
  .then(content => gzip(content))
  .then(compressed => writeFile(cssMinPath.replace('.min.css', '.min.css.gz'), compressed));
};

const convertJs = () => {
  const outputFile = path.join(config.bundleFolder, config.jsBundle);
  const convert = `npx babel src/ --out-file ${outputFile} --source-maps`;
  return execAsync(convert);
};

const minifyJs = () => {
  const input = path.join(config.bundleFolder, config.jsBundle);
  const output = path.join(config.buildFolder, config.jsBundle.replace('.js', '.min.js'));
  const minify = `npx minify ${input} -o ${output}`;
  return execAsync(minify);
};

const gzipJs = () => {
  const input = path.join(config.buildFolder, config.jsBundle.replace('.js', '.min.js'));
  const output = input.replace('.min.js', '.min.js.gz');
  return readFile(input, 'utf-8')
  .then(content => gzip(content))
  .then(compressed => writeFile(output, compressed))
};

const jsActions = () => {
  return convertJs().then(minifyJs).then(gzipJs);
};

const copyAssets = () => {
  const copy = (dest) => (src) => execAsync(`cp ${src} ${dest}`);
  const assets = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
  ].map(v => 'src/**/*' + v)
  .map(v => glob(v));
  return Promise.all(assets)
  .then(files => lodash.flattenDeep(files))
  .then(files => {
    return Promise.all([
      Promise.all(files.map(copy(config.buildFolder))),
      Promise.all(files.map(copy(config.bundleFolder))),
    ])
  });
};

cleanup()
  .then(mkdirs)
  .then(() => Promise.all([copyAssets(), minifyCss(), jsActions()]))
.catch(e => {
  console.log('something went wrong...');
  throw new Error(e);
});
