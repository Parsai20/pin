const mongoose = require('mongoose');

const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://localhost:27017/pin');

// Define the schema for the user
const userSchema = new mongoose.Schema({

  fullname: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId, // Assuming posts are references to another model
    ref: 'Post'
  }],
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profiledp: {
    type: String, // Could be a URL to the image or a file path
  },
 
  number:{
    type: Number,
    required: true
  }
});

userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema);