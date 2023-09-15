const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./database/database");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
});

// Config
require("dotenv").config({ path: "config/config.env" });

// Connecting to database
connectDatabase();

//Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on port:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
});
