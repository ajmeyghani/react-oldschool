const {exec} = require('child_process');
const fs = require('fs');
const config = require('../config.json');
const path = require('path');
const outputFile = path.join(config.bundleFolder, config.jsBundle);
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');
const {getBoundaries, resetScripts, addScript, removeScript} = require('./lib/parser');
const jsBoundaries = {
  start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
  end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
};
const toAdd = `<script src="/${config.bundleFolder}/${config.jsBundle}"></script>`;

try {
  fs.writeFileSync(indexFile, resetScripts(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries));
  fs.writeFileSync(indexFile,
    addScript(fs.readFileSync(indexFile, 'utf-8'), jsBoundaries, toAdd));
} catch(e) {
  throw new Error(e);
}

exec(`npx babel -w src/ --out-file ${outputFile} --source-maps`, (err, stdout, stderr) => {
  if (err) {
    throw new Error(err);
  }
});
