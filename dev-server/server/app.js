const path = require('path');
const config = require('../config.json');
const express = require('express');
const mockApi = require('./mock-api');
const app = express();
const ROOT_PATH = process.cwd();
const nodeModules = path.join(ROOT_PATH, 'node_modules');
const src = path.join(ROOT_PATH, 'src');
const js = path.join(ROOT_PATH, 'js');
const devBundles = path.join(ROOT_PATH, config.bundleFolder);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/node_modules', express.static(nodeModules));
app.use('/src', express.static(src));
app.use('/js', express.static(js));
app.use('/' + config.bundleFolder, express.static(devBundles));
app.use('/api', mockApi);

app.all(/^\/(?!api).*/, (req, res) => {
  res.render('pages/index', {
    browserRefreshUrl: process.env.BROWSER_REFRESH_URL,
    today: new Date(),
    jsBundlePath: `/${config.bundleFolder}/${config.jsBundle}`,
    cssBundlePath: `/${config.bundleFolder}/${config.cssBundle}`,
  });
});

const isAllJs = new RegExp(`.*${config.jsBundle}$`);
app.all(isAllJs, (req, res) => {
  res.sendFile(config.jsBundle, {root: path.join(config.bundleFolder) });
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
