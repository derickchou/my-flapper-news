'use strict';
// Declare app level module which depends on views, and components
angular.module('flapperNews', ['ui.router'])
.factory('posts', ['$http',function($http){
  // service body
	var o = {
	    posts: []
	 };

	  o.getAll = function() {

	    return $http.get('/posts').success(function(data){
	    	// debugger
	      angular.copy(data, o.posts);
	    });
	  };

	  o.create = function(post) {
		  return $http.post('/posts', post).success(function(data){
		    // debugger
		    o.posts.push(data);
		  });
		};

		o.upvote = function(post) {
		  return $http.put('/posts/' + post._id + '/upvote')
		    .success(function(data){
		    	// debugger
		      post.upvotes += 1;
		    });
		};

		o.get = function(id) {
		  return $http.get('/posts/' + id).then(function(res){
		    return res.data;
		  });
		};
		o.addComment = function(id, comment) {
		  return $http.post('/posts/' + id + '/comments', comment);
		};

		o.upvoteComment = function(post, comment) {
		  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
		    .success(function(data){
		      comment.upvotes += 1;
		    });
		};
	  return o;

}])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
  		resolve: {
		  postPromise: ['posts', function(posts){
		    return posts.getAll();
		  }]
		}
    })
    .state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
		  post: ['$stateParams', 'posts', function($stateParams, posts) {
		    return posts.get($stateParams.id);
		  }]
		}

	});

  $urlRouterProvider.otherwise('home');
}])
.controller('MainCtrl',['$scope','posts',function($scope,posts){
	$scope.test="hello world!";
	// $scope.posts = [
	//   {title: 'post 1', upvotes: 5},
	//   {title: 'post 2', upvotes: 2},
	//   {title: 'post 3', upvotes: 15},
	//   {title: 'post 4', upvotes: 9},
	//   {title: 'post 5', upvotes: 4}
	// ];
	//Bind the $scope.posts variable in our controller
	//to the posts array in our service:
	$scope.posts=posts.posts;

	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return; };
	  	// $scope.posts.push({
	  	posts.create({
	  		title: $scope.title,
	  		link: $scope.link, 
	  		// upvotes: 0,
	  		// comments: [{author: 'Joe', body: 'Cool post!', upvotes: 0},
			  //   {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}]
	  	});
	  	// debugger
	  	$scope.title='';
	  	$scope.link='';
	};
	$scope.incrementUpvotes = function(post) {
	  	// post.upvotes += 1;
	  	posts.upvote(post);
	};
}])
.controller('PostsCtrl', ['$scope','posts','post',function($scope, posts, post){
		$scope.post = post;

		$scope.addComment = function(){
			// debugger
		  if($scope.body === '') { return; }
		  posts.addComment(post._id, {
		    body: $scope.body,
		    author: 'user',
		  }).success(function(comment) {
		    $scope.post.comments.push(comment);
		  });
		  $scope.body = '';
		};

		$scope.incrementUpvotes = function(comment){
		  posts.upvoteComment(post, comment);
		};
}]);
