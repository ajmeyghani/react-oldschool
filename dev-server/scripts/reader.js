const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

/**
 * Given a string, representing the content of a file, returns
 * the start and the end line numbers where the pattern appears in the file.
 * @param  {string} content content of the file.
 * @param  {object} patterns  object containing the regular expressions using start and end fields
 * @return {object}           object containing the `start`, `end` index, and the original `content`
 */
const getBoundaries = (content, patterns) => {
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
 * @param  {string} indexContent content of the file, usually index.html
 * @return {string} content of the file after the scripts lines have been removed.
 */
const resetScripts = (indexContent, patterns) => {
  const {start, end, content} = getBoundaries(indexContent, patterns);
  if(start === end - 1) {
    return content;
  }
  const lines = content.split('\n');
  const leftPartition = lines.slice(0, start + 1);
  const rightPartition = lines.slice(end, lines.length);
  return leftPartition.concat(rightPartition).join('\n');
};

/**
 * Adds a script to a given index.html file.
 * @param  {string} indexContent content of the file, usually index.html.
 * @param  {object} patterns  object containing `start` and `end` regular expressions to determine
 * the boundaries where the scripts or links should be added.
 * @param  {string} newItem   the item/scrip to be added.
 * @return {string} newContent  new content with the scripts added.
 */
const addScript = (indexContent, patterns, newItem) => {
  const {start, end, content} = getBoundaries(indexContent, patterns);
  const lines = content.split('\n');
  const left = lines.slice(0, end);
  const leftPlusNewScript = left.concat(newItem);
  const all = leftPlusNewScript.concat(lines.slice(end, lines.length));
  let newContent =  all.join('\n');
  return newContent;
};

/**
 * Removes a script from a given string, representing the content of a file, usually index.html.
 * @param  {string} indexContent content of the file, usually index.html.
 * @param  {object} patterns  object containing `start` and `end` regular expressions to determine
 * the boundaries where the scripts or links should be removed.
 * @param  {string} toRemove  the item/scrip to be removed.
 * @return {string} newContent  the new content with the given scripts removed.
 */
const removeScript = (indexContent, patterns, toRemove) => {
  const {start, end, content} = getBoundaries(indexContent, patterns);
  const lines = content.split('\n');
  if(Array.isArray(toRemove)) {
    const doesContain = (v, arr) => arr.some(r => ~v.search(new RegExp(`${r}\\b`)));
    const remove = (vals, key) => (
      vals.filter(v => doesContain(v, key) ? false : true)
    );
    return remove(lines, toRemove).join('\n');
  } else {
    return lines.filter(v => v.search(toRemove) === -1).join('\n');
  }
};

module.exports = {
  getBoundaries, resetScripts, addScript, removeScript,
};
