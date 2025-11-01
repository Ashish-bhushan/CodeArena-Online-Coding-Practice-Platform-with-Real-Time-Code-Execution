const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING, {
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("⚠️ MongoDB connection error:", err.message);
  }
}
module.exports = main;
