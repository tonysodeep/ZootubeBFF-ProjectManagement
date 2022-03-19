const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinary');

const HttpError = require('../models/http-errors');
const Video = require('../models/video');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

const getVideos = async (req, res, next) => {
  let videos;
  try {
    videos = await Video.find().populate('creator', ['username', 'id']);
  } catch (err) {
    const error = new HttpError(
      'Opps something went wrong could not get all places!!!',
      500
    );
    return next(error);
  }

  res.json({
    videos: videos.map((video) => video.toObject({ getters: true })),
  });
};

const getVideoById = async (req, res, next) => {
  const videoId = req.params.vid;

  let video;
  try {
    video = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError(
      'Some thing went wrong could not find place',
      500
    );
    return next(error);
  }

  if (!video) {
    const error = new HttpError(
      'Could not find a video for the provided id',
      404
    );
    return next(error);
  }

  res.json({
    video: video.toObject({ getters: true }),
  });
};

const getVideosByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithVideos;
  let user;
  try {
    userWithVideos = await User.findById(userId).populate('videos');
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('fetching data fail', 500);
    return next(error);
  }

  if (!userWithVideos) {
    return next(
      new HttpError('Could not find videos for the provided user id', 404)
    );
  }

  res.json({
    name: user.username,
    imageUrl: user.userImage,
    userVideos: userWithVideos.videos.map((video) =>
      video.toObject({ getters: true })
    ),
  });
};

const createVideo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input, please check your input data', 422)
    );
  }
  const { title, description, creator } = req.body;

  //cái này mo phong lúc  uppload video lên s3 rồi lấy video url
  try {
    const uploader = await cloudinary.uploads(req.file.path, 'Images');
    console.log('uploader', uploader);
  } catch (err) {
    console.log(err);
    return next(new HttpError('error when upload image', 500));
  }

  let resource = {
    imageUrl: req.file.path,
    videoUrl: 'https://www.youtube.com/watch?v=Pv7JKxRd7jo',
  };

  const createdVideo = new Video({
    title,
    description,
    resource,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place fail, please try agian', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('could not find user for provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdVideo.save({ session: sess });
    user.videos.push(createdVideo);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('creating video fail', 500);
    return next(error);
  }

  res.status(201).json({ video: createdVideo.toObject({ getters: true }) });
};

const updateVideo = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input, please check your input data', 422)
    );
  }

  const { title, description } = req.body;
  const videoId = req.params.vid;

  let updatedVideo;
  try {
    updatedVideo = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }

  updatedVideo.title = title;
  updatedVideo.description = description;

  try {
    await updatedVideo.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong,could not update place ',
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ updatedVideo: updatedVideo.toObject({ getters: true }) });
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.vid;
  let video;
  try {
    video = await Video.findById(videoId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong could not delete place',
      500
    );
    return next(error);
  }
  if (!video) {
    const error = new HttpError('could not find video for this id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await video.remove({ session: sess });
    video.creator.videos.pull(video);
    await video.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Could not delete video please try agian later',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Video' });
};

exports.getVideos = getVideos;
exports.getVideoById = getVideoById;
exports.getVideosByUserId = getVideosByUserId;
exports.createVideo = createVideo;
exports.updateVideo = updateVideo;
exports.deleteVideo = deleteVideo;
