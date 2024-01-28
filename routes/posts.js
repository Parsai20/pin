const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = new mongoose.Schema({
  
  image: { 
    type: String
   },

  imagetext: {
    type: String
  },
  
  imagedesc: {
    type: String
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now // Automatically set to the current date and time
  },
  likes: {
    type: Array,
    default: [] // Default value for likes is 0
  }  
});

// Compile the schema into a model
module.exports  = mongoose.model('Post', postSchema);
