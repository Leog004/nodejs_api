const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/my-booking', bookingController.createBookingCheckout);

router.use(authController.protect);

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.route('/').get(bookingController.getAllBookings);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
