const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config({ path: './.env' })
exports.connect = () => {
  mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, UseUnifiedTopology: true })
    .then(() => {
      console.log("MongoDB is connect")
    }).catch((err) => {
      console.log(err)
    })
}