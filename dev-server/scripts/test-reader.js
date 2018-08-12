const path = require('path');
const {readFile, resetFile, addScript, removeScript} = require('./reader');
const indexFile = path.join(__dirname, '../', 'server/views/pages/index.ejs');

const cssBoundaries = {
  start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
  end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
};

const jsBoundaries = {
  start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
  end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
};

resetFile(indexFile, cssBoundaries);
resetFile(indexFile, jsBoundaries);
addScript(indexFile, cssBoundaries, 'css file');
addScript(indexFile, cssBoundaries, ['css file 2', 'css file 3']);

addScript(indexFile, jsBoundaries, 'js file 1');
addScript(indexFile, jsBoundaries, ['js file 2', 'js file 3', 'js file 4']);

removeScript(indexFile, cssBoundaries, 'css file 3');
removeScript(indexFile, jsBoundaries, 'js file 2');
