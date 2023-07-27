const router = require("express").Router();
let Exercise = require("../models/exercise.model");
const genericErrorMsg = "Something went wrong, please try again later";

router.route("/").get((req, res) => {
  Exercise.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);

  const newExercise = new Exercise({ username, description, duration, date });

  newExercise
    .save()
    .then(() => res.json("Exercise added!"))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

//get selected item

router.route("/:id").get((req, res) => {
  Exercise.findById(req.params.id)
    .then((excercise) => res.json(excercise))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

//delete

router.route("/:id").delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json("Exercise deleted."))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

//update

router.route("/update/:id").post((req, res) => {
  Exercise.findById(req.params.id).then((exercise) => {
    exercise.username = req.body.username;
    exercise.description = req.body.description;
    exercise.duration = Number(req.body.duration);
    exercise.date = Date.parse(req.body.date);

    exercise
      .save()
      .then(() => res.json("Exercise Updated."))
      .catch((err) => res.status(400).json(genericErrorMsg));
  });
});

module.exports = router;
