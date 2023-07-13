const express = require('express');
const router = express.Router();

// MongoDB user model
const User = require('./../models/User');

// Password handler
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  if (name === '' || email === '' || password === '' || dateOfBirth === '') {
    res.json({
      status: 'Failed',
      message: 'Empty input fields!',
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: 'Failed',
      message: 'Invalid name entered',
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'Failed',
      message: 'Invalid email entered',
    });
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: 'Failed',
      message: 'Invalid date of birth entered',
    });
  } else if (password.length < 8) {
    res.json({
      status: 'Failed',
      message: 'Password is too short!',
    });
  } else {
    // Checking if user already exists
    User.find({ email })
      .then((results) => {
        if (results.length) {
          // A user already exists
          res.json({
            status: 'Failed',
            message: 'User with provided email already exists',
          });
        } else {
          // Try to create new user

          // Password handler
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                dateOfBirth,
              });

              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: 'Success',
                    message: 'Signup successful',
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: 'Failed',
                    message: 'An error occurred while saving the user account!',
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: 'Failed',
                message: 'An error occurred while hashing the password!',
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 'Failed',
          message: 'An error occurred while checking for an existing user!',
        });
      });
  }
});

module.exports = router;
