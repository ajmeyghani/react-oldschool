const {exec} = require('child_process');
const config = require('../config.json');

exec(`rm -rf ${config.bundleFolder}`, (err, stdout, stderr) => {
  if (err) {
    throw new Error(err);
  }
  exec(`mkdir ${config.bundleFolder}`, (err, stdout, stderr) => {
    if (err) {
      throw new Error(err);
    }
    console.log('Created bundle folder');
  });
});
