const express = require ('express');
const {body} = require ('express-validator');

const router = express.Router ();

const authController = require ('../controllers/authController');
const User = require ('../models/user');

// POST /auth/signup
router.post (
  '/signup',
  [
    body ('name')
      .not ()
      .isEmpty ()
      .withMessage ('Please enter a name')
      .isLength ({min: 5})
      .withMessage (
        'Please enter a name with only number and text and atleast 5 characters long'
      ),
    body ('email')
      .isEmail ()
      .withMessage ('Please enter a valid email')
      .custom ((value, {req}) => {
        return User.findOne ({email: value}).then (userDoc => {
          if (userDoc) {
            return Promise.reject (
              'E-Mail already exist, please pick a different one'
            );
          }
        });
      })
      .normalizeEmail (),
    body (
      'password',
      'Please enter a password with only number and text and atleast 5 characters long'
    )
      .isLength ({min: 5})
      .isAlphanumeric (),
  ],
  authController.signup
);

// POST /auth/login
router.post (
  '/login',
  [
    body ('email')
      .isEmail ()
      .withMessage ('Please enter a valid email')
      .normalizeEmail (),
  ],
  authController.login
);

module.exports = router;
