const express = require("express");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const mongoose = require("mongoose");

const app = express();

//Contact DB
mongoose.connect("mongodb://localhost/smartedu-db")
.then(() => {
  console.log("Connected to DB");
})

//Template Engine
app.set("view engine", "ejs");

//Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
