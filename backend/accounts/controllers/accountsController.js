const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../db/userModel');

const jwtSecret = process.env.JWT_SECRET || 'kimenyublogs';

module.exports.register = async (request, response) => {
  // Validate email, password, username, and confirmPassword
  const registrationValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('username').notEmpty(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ];

  // Check for validation errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if email already exists
    const existingEmailUser = await User.findOne({ email: request.body.email });
    if (existingEmailUser) {
      return response.status(400).json({ error: 'Email already exists' });
    }

    // Check if username already exists
    const existingUsernameUser = await User.findOne({ username: request.body.username });
    if (existingUsernameUser) {
      return response.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    // Create a new user instance
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
      username: request.body.username,
    });

    // Save the new user
    const result = await user.save();

    // Return success if the new user is added to the database successfully
    response.status(201).json({
      message: 'User Created Successfully',
      result,
    });
  } catch (error) {
    console.error('Registration error:', error);
    response.status(500).json({
      message: 'Error creating user',
    });
  }
};

module.exports.login = async (request, response) => {
  try {
    const { username, password } = request.body;

    // Check if username exists
    const user = await User.findOne({ username });

    if (!user) {
      return response.status(404).json({
        message: 'Username not found',
      });
    }

    // Compare the password entered and the hashed password found
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return response.status(400).json({
        message: 'Passwords do not match',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      jwtSecret,
      { expiresIn: '1d' } // Adjust the expiry time as needed
    );

    // Return success response
    response.status(200).json({
      message: 'Login successful',
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({
      message: 'Internal server error',
    });
  }
};