const bcrypt = require ('bcrypt');
const {validationResult} = require ('express-validator');
const jwt = require ('jsonwebtoken');

const User = require ('../models/user');

exports.signup = (req, res, next) => {
  const {name, email, password} = req.body;
  const error = validationResult (req);
  if (!error.isEmpty ()) {
    return res.status (422).json ({error: error.array ()[0].msg});
  }
  bcrypt
    .hash (password, 12)
    .then (hashedPassword => {
      const user = new User ({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save ();
    })
    .then (result => {
      res.status (201).json ({message: 'User created!', userId: result._id});
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};

exports.login = (req, res, next) => {
  const {email, password} = req.body;
  let loadedUser;
  const error = validationResult (req);
  if (!error.isEmpty ()) {
    return res.status (422).json ({error: error.array ()[0].msg});
  }
  User.findOne ({email: email})
    .then (user => {
      if (!user) {
        res
          .status (401)
          .json ({error: 'A user with that email could not be found'});
      }
      loadedUser = user;
      return bcrypt.compare (password, user.password);
    })
    .then (isEqual => {
      if (!isEqual) {
        res.status (401).json ({error: 'Wrong password'});
      }
      const token = jwt.sign (
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString (),
        },
        'somesupersecret',
        {expiresIn: '1h'}
      );
      res
        .status (200)
        .json ({token: token, userId: loadedUser._id.toString ()});
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};
