const mongoose = require("mongoose");
const config = require("./config");

const connect = async () => {
  try {
    const db = mongoose.connect(config.mongoUrl);
    console.log("Connected At With Database");
  } catch (error) {
    console.log("Connection Error :- ", error);
  }
};

module.exports =  connect ;
