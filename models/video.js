const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdDate: { type: Number, default: Date.now() },
  resource: {
    imageUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Video', videoSchema);