const express = require('express');

const { check } = require('express-validator');

const videoController = require('../controllers/videos-controller');

const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', videoController.getVideos);

router.get('/:vid', videoController.getVideoById);

router.get('/user/:uid', videoController.getVideosByUserId);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty().trim(),
    check('description').isLength({ min: 5 }).not().isEmpty().trim(),
  ],
  videoController.createVideo
);

router.patch(
  '/:vid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }).not().isEmpty(),
  ],
  videoController.updateVideo
);

router.delete('/:vid', videoController.deleteVideo);

module.exports = router;
