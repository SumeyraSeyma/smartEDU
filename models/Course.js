const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a course name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
});