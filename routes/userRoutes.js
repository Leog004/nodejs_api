const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

// LOGIN | SIGNUP
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// PASSWORD CONFIGURATION
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// USER MUST BE LOGGED IN
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
// SELF INFO || SELF UPDATE / DELETE
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// USER MUST BE LOGGED IN AND ADMIN TO VIEW THESE ROUTES
router.use(authController.restrictTo('admin'));
// CRUD OPERATIONS
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
