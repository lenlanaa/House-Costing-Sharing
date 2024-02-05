require('dotenv').config();
const express = require('express');
const allRoutes = require('./routes/index');
const authRoute = require('./routes/auth.routes');
const { default: mongoose } = require('mongoose');
const app = express();
const cors = require("cors");
const path = require('path');
const multer= require('multer');

app.use(express.json());

var corsOptions = {
    origin: ['http://localhost:5173'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}

app.use(cors(corsOptions));

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'storage/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname )
//     }
//   })
//   const upload = multer({storage})
// app.set('view engine', 'ejs');
// app.post("/upload", upload.single('image'), (req, res) => {
//     res.send("Image Saved");
// });
// app.post("/upload", (req, res) => {
//     res.send("image upload");
// });
app.use('/api/Aprop', allRoutes);
app.use('/api/Aprop', authRoute);

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('database connected on port ' + process.env.PORT);
    })
    .catch (err => console.log("couldn't connect to MongoDb"))
});

