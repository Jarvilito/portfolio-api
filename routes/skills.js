const router = require("express").Router();
let Skills = require("../models/skills.model");
const genericErrorMsg = "Something went wrong, please try again later";

router.route("/").get((req, res) => {
  Skills.find()
    .then((skills) => res.json(skills))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/add").post((req, res) => {
  const label = req.body.label;
  const icon = req.body.icon;
  const rate = Number(req.body.rate);
  const color = req.body.color;
  const type = req.body.type;

  const newSkills = new Skills({
    label,
    icon,
    rate,
    color,
    type,
  });

  newSkills
    .save()
    .then((skill) => res.json(skill))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").get((req, res) => {
  Skills.findById(req.params.id)
    .then((skill) => res.json(skill))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/:id").delete((req, res) => {
  Skills.findByIdAndDelete(req.params.id)
    .then((skill) => res.json("Skills deleted."))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/update/:id").post((req, res) => {
  Skills.findById(req.params.id).then((skill) => {
    skill.label = req.body.label;
    skill.icon = req.body.icon;
    skill.rate = Number(req.body.rate);
    skill.color = req.body.color;
    skill.type = req.body.type;

    skill
      .save()
      .then((skill) => res.json(skill))
      .catch((err) => res.status(400).json("Error"));
  });
});

module.exports = router;
