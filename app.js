const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const port = 5569;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose
  .connect(
    'mongodb+srv://admin:tgof5569A@cluster0.ufvlg.mongodb.net/zootubeDatabase?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5069);
  })
  .catch((err) => {
    console.log(err);
  });
