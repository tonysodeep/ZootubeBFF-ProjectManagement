const express = require('express');
const appTesting = express();

appTesting.get('/test', (_req, res) => {
  res.status(200).send('Hello world');
});

module.exports = appTesting;