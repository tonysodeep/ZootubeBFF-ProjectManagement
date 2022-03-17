const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    [check('email').isEmail().normalizeEmail().trim()],
    check('username').not().isEmpty().trim(),
    check('password').isLength({ min: 6 }).trim(),
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
