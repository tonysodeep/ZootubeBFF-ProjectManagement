const express = require('express');
const appTesting = express();

appTesting.get('/test', (_req, res) => {
  res.status(200).send('Hello world');
});

// const mathOperations = {
//   sum: function (a, b) {
//     return a + b;
//   },

//   diff: function (a, b) {
//     return a - b;
//   },
//   product: function (a, b) {
//     return a * b
//   }
// }

// module.exports = mathOperations
module.exports = appTesting;