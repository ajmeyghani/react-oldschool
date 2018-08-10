const path = require('path');
const express = require('express');
const mockApi = require('./mock-api');
const app = express();
const ROOT_PATH = process.cwd();
const nodeModules = path.join(ROOT_PATH, 'node_modules');
const publicPath = path.join(ROOT_PATH, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/node_modules', express.static(nodeModules));
app.use('/public', express.static(publicPath));
app.use('/api', mockApi);

app.all(/^\/(?!api).*/, (req, res) => {
  res.render('pages/index', {
    browserRefreshUrl: process.env.BROWSER_REFRESH_URL,
    today: new Date(),
  });
});

app.all(/.*bundle\.js$/, (req, res) => {
  res.sendFile('bundle.js', {root: path.join('public') });
});

app.all("/404", (req, res, next) => {
  res.render('pages/error', {
    reason: 'not sure',
  });
});

app.get('*', (req, res, next) => {
 console.log("404: " + req.originalUrl + " was not found")
 res.status(404).redirect('/404');
});

module.exports = app;
