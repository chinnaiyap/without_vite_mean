require("dotenv").config();
const mongoose = require("mongoose");

// ==============================
// CONNECT DATABASE
// ==============================

const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL);


    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;