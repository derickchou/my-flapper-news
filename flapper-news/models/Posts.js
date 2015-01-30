var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

//Adds an instance method to documents 
//constructed from Models compiled from this schema.
PostSchema.methods.upvote=function(cb){
	this.upvotes+=1;
	this.save(cb);
}

module.exports=mongoose.model('Post', PostSchema);