//First - config the ENV
require("dotenv").config();

//Other imports
const express = require('express');
const fileuploader = require('express-fileupload');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

//Set Port
const PORT = process.env.PORT || 5000;

//Connect to Mongoose
connectDB();

//Start server
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileuploader());

//Load and set-routes
app.use("/api/new_post", require("./routes/newPostRoute"));
app.use("/api/show_posts", require("./routes/showPostsRoute"));
app.use("/api/delete_post", require("./routes/deletePostRoute"));
app.use("/api/user", require("./routes/userRoute"));

//Middleware
app.use(errorHandler);

//Set a default path to the client once built
if (process.env.NODE_ENV === "production"){
    app.use(express.static('client/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });
}

//Listen to server
app.listen(PORT, () => console.log(`App running on PORT: ${PORT}!`));