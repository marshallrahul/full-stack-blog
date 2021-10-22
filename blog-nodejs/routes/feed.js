const express = require ('express');
const {body} = require ('express-validator');

const router = express.Router ();

const feedController = require ('../controllers/feedController');

const isAuth = require ('../middlewares/is-auth');

// GET /feed/posts
router.get ('/posts', feedController.getPosts);

// GET /feed/post/:postId
router.get ('/post/:postId', feedController.getPost);

// POST /feed/post
router.post (
  '/post',
  isAuth,
  [
    body ('title').trim ().isLength ({min: 5}),
    body ('content').trim ().isLength ({min: 5}),
  ],
  feedController.createPosts
);

// PUT /feed/post/:postId
router.put (
  '/post/:postId',
  isAuth,
  [
    body ('title').trim ().isLength ({min: 5}),
    body ('content').trim ().isLength ({min: 5}),
  ],
  feedController.updatePost
);

// DELETE /feed/post/:postId
router.delete ('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
