const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post(async (req, res) => {
  const username = req.body.username;
  const password = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({ username, password });

  newUser
    .save()
    .then(() => res.json("User Registration Success!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/login", passport.authenticate("local"), function (req, res) {
  res.json("success");
});
module.exports = router;
