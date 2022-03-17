const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const videosRoute = require('./routes/videos-route');
const userRoute = require('./routes/users-route');

app.use(bodyParser.json());

const port = 5569;

app.use('/api/videos', videosRoute);
app.use('/api/users', userRoute);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
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
