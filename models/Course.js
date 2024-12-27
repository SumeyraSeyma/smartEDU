const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a course name"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please provide a category"],
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

CourseSchema.pre('validate', function(next){
  this.slug = slugify(this.name, {
    lower: true,
    strict: true
  });
  next();
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
