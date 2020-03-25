const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User');

// Register
router.post(
  '/signup',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { username, password, campus, course } = req.body;
    // Create the user
    const newUser = await User.create({ username, password, campus, course });

    // Directly login user
    req.logIn(newUser, err => {
      res.json(_.pick(req.user, ['username', '_id', 'createdAt', 'updatedAt']));
    });
  }
);

// Login
router.post(
  '/login',
  ensureLogin.ensureLoggedOut(),
  passport.authenticate('local'),
  (req, res) => {
    // Return the logged in user
    return res.json(
      _.pick(req.user, ['username', '_id', 'createdAt', 'updatedAt'])
    );
  }
);

// Update user fields
router.post('/edit', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const { username, campus, course } = req.body;
  const loggedUser = req.user;
  // Create the user
  const newUser = await User.create({ username, password, campus, course });

  try {
    //check if the new username sent is from one registered user
    const existingUser = await User.findOne({ username });
    // Update user in database if username is available
    if (!existingUser) {
      loggedUser.username = username;
      loggedUser.campus = campus;
      loggedUser.course = course;
      await loggedUser.save();
      //req.flash('error', 'Updated user!');
      return res.json(
        req.user(req.user, ['username', '_id', 'createdAt', 'updatedAt'])
      );
      // if the username is taken
    } else {
      // check if it's taken by the logged user
      if (loggedUser.username === existingUser.username) {
        loggedUser.campus = campus;
        loggedUser.course = course;
        await loggedUser.save();
        return res.json(
          req.user(req.user, ['username', '_id', 'createdAt', 'updatedAt'])
        );
        // if it doesn't correspond to the logged user
      } else {
        res.status(401).json({ status: `You can't use that username` });
      }
    }
  } catch (e) {
    next(e);
  }
});

// Logout
router.get('/logout', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.user) {
    req.logout();
    return res.json({ status: 'Logged out' });
  } else {
    return res
      .status(401)
      .json({ status: 'You have to be logged in to logout' });
  }
});

// Check if the user is logged in
router.get('/loggedin', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.user) return res.json(req.user);
  else return res.status(401).json({ status: 'No user session present' });
});

module.exports = router;
