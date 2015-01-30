var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/Posts');
var Comment = require('../models/Comments');
// var Post = mongoose.model('Post');
// var Comment = mongoose.model('Comment');

router.get('/',function(req,res){
 	res.render('index', { title: 'Express' });
});

// router.get('/posts/:post', function(req, res) {
//   res.json(req.post);
// });

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});

router.get('/posts', function(req, res,next) {
  Post.find(function(err,posts){
  	if(err){return next(err);}
  	res.json(posts);
  });
});


router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { console.log(post);return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    console.log(post);
    return next();
  });
});

router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  console.log(post);
  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});



module.exports = router;

// The actions map directly to several routes, which are described as follows:

// GET /posts - return a list of posts and associated metadata
// POST /posts - create a new post
// GET /posts/:id - return an individual post with associated comments
// PUT /posts/:id/upvote - upvote a post, notice we use the post ID in the URL
// POST /posts/:id/comments - add a new comment to a post by ID
// PUT /posts/:id/comments/:id/upvote - upvote a comment
