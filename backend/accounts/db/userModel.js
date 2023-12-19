const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: "Please provide a valid email",
    },
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: [true, "Username already exists"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password should be at least 6 characters long"],
    trim: true,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        // Only validate if the password field is present
        return this.password ? value === this.password : true;
      },
      message: "Passwords do not match",
    },
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

// Custom validation for confirmPassword field
userSchema.path('confirmPassword').validate(function (value) {
  // Only validate if the password field is present
  return this.password ? value === this.password : true;
}, 'Passwords do not match');

module.exports = mongoose.model('User', userSchema);
