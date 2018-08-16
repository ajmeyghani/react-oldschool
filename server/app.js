const path = require('path');
const config = require('../config.json');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const mockApi = require('./mock-api');
const app = express();
const buildFolder = path.join(process.cwd(), config.buildFolder);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api', mockApi);

const staticPaths = ['node_modules', 'src', config.devJs, config.bundleFolder,];
staticPaths.map((p) => ({
  name: '/' + p,
  fullpath: path.join(process.cwd(), p),
}))
.forEach((p) => {
  app.use(p.name, express.static(p.fullpath));
});

app.use('/' + config.buildFolder, expressStaticGzip(buildFolder));

app.all(/^\/(?!api).*/, (req, res) => {
  res.render('pages/index', {
    browserRefreshUrl: process.env.BROWSER_REFRESH_URL,
    today: new Date(),
  });
});

const isJsBundle = new RegExp(`.*${config.jsBundle}$`);
app.all(isJsBundle, (req, res) => {
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
