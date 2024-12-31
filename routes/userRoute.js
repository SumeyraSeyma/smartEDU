const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const {body} = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post(
    [
        body('name').notEmpty().withMessage('Please enter your name'),
        body('email').isEmail().withMessage('Please enter a valid email address')
        .custom(
            (userEmail) => {
                return User.findOne({email: userEmail}).then(user => {
                    if(user) {
                        return Promise.reject('User already exists with this email');
                    }
            })
      }),

        body('password').notEmpty().withMessage('Password cannot be empty')
    ]
    ,authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware , authController.getDashboardPage);
router.route('/:id').delete(authController.deleteUser);

module.exports = router;