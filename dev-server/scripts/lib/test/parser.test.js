const test = require('tape');
const tapSpec = require('tap-spec');
const fixture = require('./index.fixture');
const {getBoundaries, resetScripts, addScript, removeScript} = require('../parser');

test.createStream().pipe(tapSpec()).pipe(process.stdout);

test('getBoundaries, for the given regular expressions (CSS):', (t) => {

  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
  };

  t.equal(getBoundaries(fixture, cssBoundaries).start, 4, 'should return the start line number.');
  t.equal(getBoundaries(fixture, cssBoundaries).end, 7, 'should return the end line number.');
  t.end();
});

test('getBoundaries, for the given regular expressions (JS):', (t) => {

  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  t.equal(getBoundaries(fixture, cssBoundaries).start, 14, 'should return the start line number.');
  t.equal(getBoundaries(fixture, cssBoundaries).end, 18, 'should return the end line number.');
  t.end();
});

test('resetScripts: for the given regular expressions (CSS):', (t) => {

  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
  js file 1
  js file 3
  js file 4
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(resetScripts(fixture, cssBoundaries), expected, 'should remove the css links');
  t.end();
});

test('resetScripts: for the given regular expressions (JS):', (t) => {

  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
  css file
  css file 2
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(resetScripts(fixture, jsBoundaries), expected, 'should remove the js script links');
  t.end();
});

test('addScript: for the given regular expressions (css):', (t) => {

  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
new css file
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
  js file 1
  js file 3
  js file 4
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(addScript(resetScripts(fixture, cssBoundaries), cssBoundaries, 'new css file'), expected, 'should add the script.');
  t.end();
});

test('addScript: for the given regular expressions (css):', (t) => {

  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
      top css file
      css file
      css file 2
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
      js file 1
      js file 3
      js file 4
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(addScript(fixture, cssBoundaries, 'top css file', 'top').replace(/\s*/g, ''),
    expected.replace(/\s*/g, ''), 'should add the script to the top');
  t.end();
});

test('addScript: for the given regular expressions (js):', (t) => {

  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <!-- start css -->
        css file
        css file 2
      <!-- end css -->
      <script src="/node_modules/react/umd/react.development.js"></script>
      <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
      <title>React Boilerplate</title>
    </head>
    <body>
      <div id="app-root"></div>
      <!-- start js -->
        js top 1
        js top 2
        js file 1
        js file 3
        js file 4
      <!-- end js -->
      <script src="<%= browserRefreshUrl %>"></script>
    </body>
    </html>`;

  t.equal(addScript(fixture, jsBoundaries, ['js top 1', 'js top 2'], 'top').replace(/\s*/g, ''),
    expected.replace(/\s*/g, ''), 'should add multiple scripts to the top.');
  t.end();
});

test('addScript: for the given regular expressions (js):', (t) => {

  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
  css file
  css file 2
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
new js file
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(addScript(resetScripts(fixture, jsBoundaries), jsBoundaries, 'new js file'), expected, 'should add the script.');
  t.end();
});

test('addScript: add multiple scripts', (t) => {

  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
  css file
  css file 2
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
new js file
new js file 2
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(addScript(resetScripts(fixture, jsBoundaries), jsBoundaries, ['new js file', 'new js file 2']), expected, 'should add multiple links.');
  t.end();
});

test('removeScript: for the given regular expressions (css):', (t) => {

  const cssBoundaries = {
    start: /.*<!\-\-\s*start\s*css\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*css\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
  css file
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
  js file 1
  js file 3
  js file 4
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(removeScript(fixture, cssBoundaries, 'css file 2'), expected, 'should remove the given script, containing the pattern.');
  t.end();
});

test('removeScript: for the given regular expressions (js):', (t) => {

  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
  css file
  css file 2
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
  js file 1
  js file 4
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(removeScript(fixture, jsBoundaries, 'js file 3'), expected, 'should remove the given script, containing the pattern.');
  t.end();
});

test('removeScript: for the given regular expressions (js or css):', (t) => {

  const jsBoundaries = {
    start: /.*<!\-\-\s*start\s*js\s*\-\->.*/,
    end: /.*<!\-\-\s*end\s*js\s*\-\->.*/,
  };

  const expected = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!-- start css -->
  css file
  css file 2
    <!-- end css -->
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
    <title>React Boilerplate</title>
  </head>
  <body>
    <div id="app-root"></div>
    <!-- start js -->
  js file 1
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

  t.equal(removeScript(fixture, jsBoundaries, ['js file 3', 'js file 4']), expected, 'should remove multiple scripts.');
  t.end();
});
