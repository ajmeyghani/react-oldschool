const path = require('path');
const config = require('../config.json');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const mockApi = require('./mock-api');
const app = express();
const ROOT_PATH = process.cwd();
const nodeModules = path.join(ROOT_PATH, 'node_modules');
const src = path.join(ROOT_PATH, 'src');
const devJs = path.join(ROOT_PATH, config.devJs);
const devBundles = path.join(ROOT_PATH, config.bundleFolder);
const buildFolder = path.join(ROOT_PATH, config.buildFolder);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/node_modules', express.static(nodeModules));
app.use('/src', express.static(src));
app.use('/' + config.devJs, express.static(devJs));
app.use('/' + config.bundleFolder, express.static(devBundles));
app.use('/' + config.buildFolder, expressStaticGzip(buildFolder));
app.use('/api', mockApi);

app.all(/^\/(?!api).*/, (req, res) => {
  res.render('pages/index', {
    browserRefreshUrl: process.env.BROWSER_REFRESH_URL,
    today: new Date(),
  });
});

const isAllJs = new RegExp(`.*${config.jsBundle}$`);
app.all(isAllJs, (req, res) => {
  res.sendFile(config.jsBundle, {root: path.join(config.bundleFolder)});
});

app.all('/404', (req, res, next) => {
  res.render('pages/error', {
    reason: 'not sure',
  });
});

app.get('*', (req, res, next) => {
 console.log('404: ' + req.originalUrl + ' was not found');
 res.status(404).redirect('/404');
});

module.exports = app;
