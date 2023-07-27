const router = require("express").Router();
const genericErrorMsg = "Something went wrong, please try again later";
let Comment = require("../models/comment.model");

router.route("/").get((req, res) => {
  Comment.find()
    .sort([["_id", -1]])
    .limit(5)
    .then((comments) => res.json(comments))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/all").get((req, res) => {
  Comment.find()
    .sort([["_id", -1]])
    .then((comments) => res.json(comments))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const postedBy = req.body.postedBy;
  const image = req.body.image;
  const date = req.body.date;
  const content = req.body.content;
  const userId = req.body.userId;

  const newComment = new Comment({
    postedBy,
    image,
    date,
    content,
    userId,
  });

  newComment
    .save()
    .then((comment) => res.json(comment))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

// router.route("/:id").get((req, res) => {
//   Skills.findById(req.params.id)
//     .then((skill) => res.json(skill))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.route("/:id").delete((req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then((comment) => res.json("Comment deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Comment.findById(req.params.id).then((comment) => {
    comment.postedBy = req.body.postedBy;
    comment.image = req.body.image;
    comment.date = req.body.date;
    comment.content = req.body.content;
    comment.userId = req.body.userId;
    comment
      .save()
      .then((comment) => res.json(comment))
      .catch((err) => res.status(400).json(genericErrorMsg));
  });
});

module.exports = router;
