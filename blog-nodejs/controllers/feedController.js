const fs = require ('fs');
const path = require ('path');
const {validationResult} = require ('express-validator');

const Post = require ('../models/post');
const User = require ('../models/user');

const ITEM_PER_PAGE = 1;

exports.createPosts = (req, res, next) => {
  const {title, content} = req.body;
  let creator;
  const error = validationResult (req);
  if (!error.isEmpty) {
    const error = new Error ('Validation failed, Entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error ('No image provided');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace ('\\', '/');
  const post = new Post ({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.userId,
  });
  post
    .save ()
    .then (() => {
      return User.findById (req.userId)
        .then (user => {
          creator = user;
          user.posts.push (post);
          return user.save ();
        })
        .then (result => {
          res.status (201).json ({
            message: 'Post created successfully',
            creator: {
              _id: creator._id,
              name: creator.name,
            },
          });
        });
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};

exports.getPosts = (req, res, next) => {
  Post.find ()
    .populate ('creator')
    .then (posts => {
      res
        .status (200)
        .json ({message: 'Fetched posts successfully', posts: posts});
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById (postId)
    .then (post => {
      res
        .status (200)
        .json ({message: 'Fetched single post successfully', post: post});
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  const error = validationResult (req);
  if (!error.isEmpty) {
    const error = new Error ('Validation failed, Entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  if (req.file) {
    imageUrl = req.file.path.replace ('\\', '/');
  }
  if (!imageUrl) {
    const error = new Error ('No image provided');
    error.statusCode = 422;
    throw error;
  }
  Post.findByIdAndUpdate (postId)
    .then (post => {
      if (post.imageUrl !== imageUrl) {
        clearImage (post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save ();
    })
    .then (result => {
      res.status (200).json ({message: 'Post updated!', post: result});
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};

const clearImage = pathToFile => {
  pathToFile = path.join (__dirname, '..', pathToFile);
  fs.unlink (pathToFile, err => console.log (err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById (postId)
    .then (post => {
      if (!post) {
        const error = new Error ('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      clearImage (post.imageUrl);
      return Post.findByIdAndRemove (postId);
    })
    .then (result => {
      res.status (200).json ({message: 'Deleted post.'});
    })
    .catch (err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next (err);
    });
};
