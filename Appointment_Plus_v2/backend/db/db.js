const mongoose = require("mongoose");

async function dbConnect() {
  const DB_URL =
    "mongodb+srv://ashutoshrout990:Reaper6500$@cluster0.xgccew1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const DB = "test";
  try {
    await mongoose.connect(DB_URL + "/" + DB);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Database error : " + error);
  }
}

module.exports = dbConnect;