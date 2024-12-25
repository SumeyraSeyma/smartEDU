const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require('./routes/userRoute');

const app = express();

//Contact DB
mongoose.connect("mongodb://localhost/smartedu-db")
.then(() => {
  console.log("Connected to DB");
})

//Template Engine
app.set("view engine", "ejs");

//Global Variables
global.userIN = null;

//Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session
  ({
    secret : "my_keyboard_cat",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/smartedu-db" })
  })
);

//Routes
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
