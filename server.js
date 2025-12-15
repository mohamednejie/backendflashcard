const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const http = require('http').createServer(app);

const DATABASE = process.env.DATABASE;
const PORT = process.env.PORT || 3000;
const maxRetries = 10;
const retryInterval = 10000;

const connectToDataBaseWithRetry = async (retryCount = 0) => {
  mongoose
    .connect(DATABASE, {})
    .then((con) => {
      console.log('✅ Database connected');
      http.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.log('❌ Error connecting to the database');
      console.log(err);
      if (retryCount < maxRetries) {
        console.log(`🔁 Retrying database connection in ${retryInterval / 1000} seconds`);
        setTimeout(() => {
          connectToDataBaseWithRetry(retryCount + 1);
        }, retryInterval);
      } else {
        console.error('🚫 Max retry attempts reached. Exiting...');
        process.exit(1);
      }
    });
};

connectToDataBaseWithRetry();
