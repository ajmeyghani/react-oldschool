const fixture = `<!DOCTYPE html>
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
  js file 3
  js file 4
    <!-- end js -->
    <script src="<%= browserRefreshUrl %>"></script>
  </body>
  </html>`;

module.exports = fixture;
