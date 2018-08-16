const express = require('express');
const api = new express.Router();

api.get('/', (req, resp) => {
  resp.json({
    data: 'hello world',
  });
});

module.exports = api;
