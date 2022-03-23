/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHALDLE EXCEPTION! * shutting down...');
  process.exit(1);
});

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.log(err));

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`App is running in port ${PORT}`);
});

process.on('unhandleRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHALDLE REJECTION! * shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERMEM RECIEVE, SHUTTING DOWM..');
  server.close(() => {
    console.log('Process terminated');
  });
});
