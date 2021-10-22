const fs = require ('fs');
const path = require ('path');
const bcrypt = require ('bcrypt');
const validator = require ('validator');
const jwt = require ('jsonwebtoken');

const Post = require ('../models/post');
const User = require ('../models/user');

const clearImage = pathToFile => {
  pathToFile = path.join (__dirname, '..', pathToFile);
  fs.unlink (pathToFile, err => console.log (err));
};

module.exports = {
  posts: async function (req) {
    const posts = await Post.find ()
      .sort ({createdAt: -1})
      .populate ('creator');
    return posts.map (p => {
      return {
        ...p.toJSON (),
        createdAt: p.createdAt.toISOString (),
        updatedAt: p.updatedAt.toISOString (),
      };
    });
  },

  post: async function ({postId}, req) {
    if (!req.isAuth) {
      const error = new Error ('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    const post = await Post.findById (postId).populate ('creator');
    return {
      ...post.toJSON (),
      createdAt: post.createdAt.toISOString (),
      updatedAt: post.updatedAt.toISOString (),
    };
  },

  createPost: async function ({inputData}, req) {
    if (!req.isAuth) {
      const error = new Error ('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty (inputData.title)) {
      errors.push ({
        message: 'Please enter a title!',
      });
    }
    if (validator.isEmpty (inputData.content)) {
      errors.push ({
        message: 'Please enter a content!',
      });
    }
    if (errors.length > 0) {
      const error = new Error ('Invalid input');
      error.data = errors;
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findById (req.userId);
    if (!user) {
      const error = new Error ('Invalid user!');
      error.statusCode = 401;
      throw error;
    }
    const post = await new Post ({
      title: inputData.title,
      content: inputData.content,
      imageUrl: inputData.imageUrl,
      creator: user,
    });
    const createdPost = await post.save ();
    user.posts.push (post);
    await user.save ();
    return {
      ...createdPost.toJSON (),
    };
  },

  updatePost: async function ({id, inputData}, req) {
    if (!req.isAuth) {
      const error = new Error ('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty (inputData.title)) {
      errors.push ({
        message: 'Please enter a title!',
      });
    }
    if (validator.isEmpty (inputData.content)) {
      errors.push ({
        message: 'Please enter a content!',
      });
    }
    if (errors.length > 0) {
      const error = new Error ('Invalid input');
      error.data = errors;
      error.statusCode = 403;
      throw error;
    }
    const post = await Post.findById (id);
    if (!post) {
      const error = new Error ('No post found!');
      error.code = 404;
      throw error;
    }
    post.title = inputData.title;
    post.content = inputData.content;
    if (post.imageUrl !== inputData.imageUrl) {
      clearImage (post.imageUrl);
    }
    if (inputData.imageUrl !== 'undefined') {
      post.imageUrl = inputData.imageUrl;
    }
    const updatedPost = await post.save ();
    return {
      ...updatedPost.toJSON (),
    };
  },

  createUser: async function ({inputData}, req) {
    const errors = [];
    if (!validator.isEmail (inputData.email)) {
      errors.push ({message: 'E-Mail is invalid!'});
    }
    if (!validator.isLength (inputData.password, {min: 5})) {
      errors.push ({
        message: 'Please enter a password atleast 5 characters long!',
      });
    }
    if (validator.isEmpty (inputData.name)) {
      errors.push ({
        message: 'Please enter a valid name!',
      });
    }
    if (validator.isEmpty (inputData.email)) {
      errors.push ({
        message: 'Please enter a valid E-Mail!',
      });
    }
    if (validator.isEmpty (inputData.password)) {
      errors.push ({
        message: 'Please enter a valid Password!',
      });
    }
    if (errors.length > 0) {
      const error = new Error ('Invalid input');
      error.data = errors;
      error.statusCode = 403;
      throw error;
    }
    const existingUser = await User.findOne ({email: inputData.email});
    if (existingUser) {
      const error = new Error (
        'E-Mail already exist, please pick a different one'
      );
      error.statusCode = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash (inputData.password, 12);
    const user = new User ({
      name: inputData.name,
      email: inputData.email,
      password: hashedPassword,
    });
    const createdUser = await user.save ();
    return {
      ...createdUser.toJSON (),
    };
  },

  login: async function ({email, password}, req) {
    if (!validator.isEmail (email)) {
      errors.push ({message: 'E-Mail is invalid!'});
    }
    if (validator.isEmpty (email)) {
      errors.push ({
        message: 'Please enter a valid E-Mail!',
      });
    }
    if (validator.isEmpty (password)) {
      errors.push ({
        message: 'Please enter a valid Password!',
      });
    }
    const user = await User.findOne ({email: email});
    if (!user) {
      const error = new Error ('A user with that email could not be found!');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare (password, user.password);
    if (!isEqual) {
      const error = new Error ('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign (
      {
        email: user.email,
        userId: user._id.toString (),
      },
      'somesupersecret',
      {expiresIn: '1h'}
    );
    return {
      userId: user._id.toString (),
      token: token,
    };
  },

  deletePost: async function ({id}, req) {
    if (!req.isAuth) {
      const error = new Error ('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    const post = await Post.findById (id);
    if (!post) {
      const error = new Error ('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

    clearImage (post.imageUrl);
    const deletedPost = await Post.findByIdAndRemove (id);
    return {
      ...deletedPost.toJSON (),
    };
  },
};
