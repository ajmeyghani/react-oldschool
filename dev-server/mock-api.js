const express = require('express');
const api = express.Router();

api.get('/', (req, resp) => {
  resp.json({
    data: 'hello world',
  });
});

module.exports = api;
