const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

//ROUTE HANDLERS
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1). MIDDLEWARE
// Implementing CORS
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(helmet());

// Logging MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limits the amount of request made per api
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'To many request from this ip.',
});
app.use('/api', limiter);

// Body Parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitizer against noSQL injection
app.use(mongoSanitize());
// Data sanitizer against XSS
app.use(xss());
// Prevents url polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Time Logging
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3). ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
