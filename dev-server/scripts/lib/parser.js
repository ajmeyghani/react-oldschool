/**
 * Given a string, representing the content of a file, returns
 * the start and the end line numbers where the pattern appears in the file.
 * @param  {string} content content of the file.
 * @param  {object} patterns object containing the regular expressions using start and end fields.
 * @return {object}          object containing the `start`, `end` index, and the lines of the file.
 */
const getBoundaries = (content, patterns) => {
  const lines = content.split('\n');
  let start = undefined;
  let end = undefined;
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
    start, end, lines,
  };
};

/**
 * Remove any scripts that are left over resulting in a clean file
 * with clear boundaries.
 * @param  {string} indexContent content of the file, usually index.html
 * @return {string} content of the file after the scripts lines have been removed.
 */
const resetScripts = (indexContent, patterns) => {
  const {start, end, lines} = getBoundaries(indexContent, patterns);
  if(start === end - 1) {
    return indexContent;
  }
  const leftPartition = lines.slice(0, start + 1);
  const rightPartition = lines.slice(end, lines.length);
  return leftPartition.concat(rightPartition).join('\n');
};

/**
 * Adds a script to a given index.html file.
 * @param  {string} indexContent content of the file, usually index.html.
 * @param  {object} patterns  object containing `start` and `end` regular expressions to determine
 * the boundaries where the scripts or links should be added.
 * @param  {string|array} newItem   the script or scripst to be added.
 * @param  {string} position   optional argument to specify where to add, 'top', 'bottom'.
 * @return {string} newContent  new content with the scripts added.
 */
const addScript = (indexContent, patterns, newItem, position) => {
  const {start, end, lines} = getBoundaries(indexContent, patterns);
  let scripts = lines.slice(start + 1, end);
  const isArray = Array.isArray(newItem);
  if(position === 'top') {
    isArray ? scripts.unshift(...newItem) : scripts.unshift(newItem);
  } else {
    scripts = scripts.concat(newItem);
  }
  return lines.slice(0, start + 1).concat(scripts).concat(lines.slice(end, lines.length)).join('\n');
};

/**
 * Removes a script from a given string, representing the content of a file, usually index.html.
 * @param  {string} indexContent content of the file, usually index.html.
 * @param  {object} patterns  object containing `start` and `end` regular expressions to determine
 * the boundaries where the scripts or links should be removed.
 * @param  {string|array} toRemove  the script or scripts to be removed.
 * @return {string} newContent  the new content with the scripts removed.
 */
const removeScript = (indexContent, patterns, toRemove) => {
  const {start, end, lines} = getBoundaries(indexContent, patterns);
  if(Array.isArray(toRemove)) {
    const doesContain = (v, arr) => arr.some(r => ~v.search(r));
    const remove = (vals, key) => vals.filter(v => doesContain(v, key) ? false : true);
    return remove(lines, toRemove).join('\n');
  }
  return lines.filter(v => v.search(toRemove) === -1).join('\n');
};

module.exports = {
  getBoundaries, resetScripts, addScript, removeScript,
};
