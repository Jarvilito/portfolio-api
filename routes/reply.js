const router = require("express").Router();
let Reply = require("../models/reply.model");
const genericErrorMsg = "Something went wrong, please try again later";

router.route("/").get((req, res) => {
  Reply.find()
    .sort([["_id", -1]])
    .limit(5)
    .then((reply) => res.json(reply))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/all").get((req, res) => {
  Reply.find()
    .sort([["_id", -1]])
    .then((reply) => res.json(reply))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/add").post((req, res) => {
  const replyBy = req.body.replyBy;
  const image = req.body.image;
  const date = req.body.date;
  const content = req.body.content;
  const userId = req.body.userId;
  const postId = req.body.postId;

  const newReply = new Reply({
    replyBy,
    image,
    date,
    content,
    userId,
    postId,
  });

  newReply
    .save()
    .then((reply) => res.json(reply))
    .catch((err) => res.status(400).json("Error:" + err));
});

// router.route("/:id").get((req, res) => {
//   Skills.findById(req.params.id)
//     .then((skill) => res.json(skill))
//     .catch((err) => res.status(400).json(genericErrorMsg));
// });

router.route("/:id").delete((req, res) => {
  Reply.findByIdAndDelete(req.params.id)
    .then((comment) => res.json("Comment deleted."))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/update/:id").post((req, res) => {
  Reply.findById(req.params.id).then((reply) => {
    reply.replyBy = req.body.replyBy;
    reply.image = req.body.image;
    reply.date = req.body.date;
    reply.content = req.body.content;
    reply.postId = req.body.postId;

    reply
      .save()
      .then((reply) => res.json(reply))
      .catch((err) => res.status(400).json("Error"));
  });
});

module.exports = router;
