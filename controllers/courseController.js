const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    req.flash("success", "Course created successfully.");
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", "Course could not be created.");
    res.status(400).redirect("/courses");
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter.category = category._id;
    }

    if (query) {
      filter.name = query;
    }

    const queryConditions = [];

    if (filter.name) {
      queryConditions.push({
        name: { $regex: ".*" + filter.name + ".*", $options: "i" },
      });
    }

    if (filter.category) {
      queryConditions.push({ category: filter.category });
    }

    const courses = await Course.find(
      queryConditions.length > 0 ? { $or: queryConditions } : {}
    )
      .sort({ createdAt: -1 })
      .populate("user");

    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      page_name: "courses",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const categories = await Category.find();
    res.status(200).render("course", {
      course,
      page_name: "courses",
      user,
      categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndDelete({ slug: req.params.slug });
    req.flash("success", "Course deleted successfully.");
    res.status(200).redirect("/dashboard");
  } catch (error) {
    req.flash("error", "Course could not be deleted.");
    res.status(400).redirect("/dashboard");
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();

    req.flash("success", "Course updated successfully.");
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    req.flash("error", "Course could not be updated.");
    res.status(400).redirect("/courses");
  }
};
