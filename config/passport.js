const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Username not found" });
          }
          try {
            if (bcrypt.compare(password, user.password)) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          } catch (e) {
            return done(e);
          }
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
