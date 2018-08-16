const util = require('util');
const path = require('path');
const {exec} = require('child_process');
const config = require('../config.json');
const execAsync = util.promisify(exec);

const cleanup = () => {
  const ROOT = process.cwd();
  const folders = [config.bundleFolder, config.devJs].map(f => path.join(ROOT, f));
  return execAsync('rm -rf ' + folders.join(' '));
};

cleanup()
  .then(r => console.log('Done dev cleanup.'))
  .catch(e => console.log('Something went wrong while cleaning up dev.'));
