const {exec} = require('child_process');
const config = require('../config.json');
const path = require('path');
const outputFile = path.join(config.bundleFolder, config.jsBundle);

exec(`npx babel -w src/ --out-dir js --source-maps`, (err, stdout, stderr) => {
  if (err) {
    throw new Error(err);
  }
});
