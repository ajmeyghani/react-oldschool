const fs = require('fs');
const path = require('path');

/**
 * Reads the given index.html file with a regular expression
 * determining the boundaries where the scripts should be added.
 * @param  {string} indexFile path to the index file
 * @param  {object} patterns  object containing the regular expressions using start and end fields
 * @return {object}           object containing the `start`, `end` index, and the original `content`
 */
const readFile = (indexFile, patterns) => {
  const content = fs.readFileSync(indexFile, 'utf-8');
  const lines = content.split('\n');
  let start = 0;
  let end = 0;

  lines.some((v, i) => {
    if(patterns.start.test(v)) {
      start = i;
      return true;
    }
  });

  lines.some((v, i) => {
    if(patterns.end.test(v)) {
      end = i;
      return true;
    }
  });

  return {
    start, end, content,
  };
};

/**
 * Remove any scripts that are left over resulting in a clean file
 * with clear boundaries.
 * @param  {string} indexFile path to the index.html file
 * @return {undefined|error}           result of writing result to file.
 */
const resetFile = (indexFile, patterns) => {
  const result = readFile(indexFile, patterns);
  const {start, end, content} = result;
  let baseContent = '';
  if(start === end - 1) {
    return fs.writeFileSync(indexFile, content);
  } else {
    const lines = content.split('\n');
    const leftPartition = lines.slice(0, start + 1);
    const rightPartition = lines.slice(end, lines.length);
    baseContent = leftPartition.concat(rightPartition).join('\n');
  }
  return fs.writeFileSync(indexFile, baseContent);
};

/**
 * Adds a script to a given index.html file.
 * @param  {string} indexFile path to the index.html file.
 * @param  {object} patterns  object containing `start` and `end` regular expressions to determine
 * the boundaries where the scripts or links should be added.
 * @param  {string} newItem   the item/scrip to be added.
 * @return {undefined|error}           result of writing the content to the index file.
 */
const addScript = (indexFile, patterns, newItem) => {
  const result = readFile(indexFile, patterns);
  const {start, end, content} = result;
  const lines = content.split('\n');

  const left = lines.slice(0, end);
  const leftPlusNewScript = left.concat(newItem);
  const all = leftPlusNewScript.concat(lines.slice(end, lines.length));

  let newContent =  all.join('\n');
  return fs.writeFileSync(indexFile, newContent);
};

/**
 * Removes a script to a given index.html file.
 * @param  {string} indexFile path to the index.html file.
 * @param  {object} patterns  object containing `start` and `end` regular expressions to determine
 * the boundaries where the scripts or links should be removed.
 * @param  {string} toRemove   the item/scrip to be removed.
 * @return {undefined|error}           result of writing the content to the index file.
 */
const removeScript = (indexFile, patterns, toRemove) => {
  const result = readFile(indexFile, patterns);
  const {start, end, content} = result;
  const lines = content.split('\n').filter(v => v.search(toRemove) === -1);
  const newContent = lines.join('\n');
  return fs.writeFileSync(indexFile, newContent);
};

module.exports = {
  readFile, resetFile, addScript, removeScript,
};
