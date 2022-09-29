const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');

const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const categoriesRoute = require('./routes/categories');

//? ENV
dotenv.config();

//? EXPRESS JSON
app.use(express.json())

//? EXPRESS STATIC
app.use("/images", express.static(path.join(__dirname, "/images")));


//? CONNECT MONGODB
mongoose
  // .connect("mongodb://127.0.0.1:27017/blog_api_db")
  .connect(process.env.MONGO_URL)
  .then(console.log("Connecting to database ..."))
  .catch((err) => console.log(err));

//? UPLOAD IMAGES
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name)
  }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

//? ROUTES
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/posts", postsRoute)
app.use("/api/categories", categoriesRoute)

//? LISTEN
app.listen("3000", () => {
  console.log("Server is running ...");
});
