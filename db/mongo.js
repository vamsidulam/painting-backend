const mongoose = require("mongoose");

let connectionPromise;

async function connectDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!process.env.DATABASE_NAME) {
    throw new Error("DATABASE_NAME is not set");
  }
  if (connectionPromise) return connectionPromise;

  mongoose.set("strictQuery", true);

  connectionPromise = mongoose
    .connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    })
    .then((conn) => {
      console.log(`MongoDB connected (db: ${process.env.DATABASE_NAME})`);
      return conn;
    })
    .catch((err) => {
      connectionPromise = undefined;
      throw err;
    });

  return connectionPromise;
}

async function disconnectDb() {
  await mongoose.disconnect();
  connectionPromise = undefined;
}

module.exports = { connectDb, disconnectDb, mongoose };
