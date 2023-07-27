const router = require("express").Router();
let Timelines = require("../models/timeline.model");
const genericErrorMsg = "Something went wrong, please try again later";

router.route("/").get((req, res) => {
  Timelines.find()
    .then((timelines) => res.json(timelines))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/add").post((req, res) => {
  const content = req.body.content;
  const color = req.body.color;
  const backgroundColor = req.body.backgroundColor;
  const dateRange = req.body.dateRange;
  const iconBackground = req.body.iconBackground;
  const iconColor = req.body.iconColor;
  const icon = req.body.icon;
  const title = req.body.title;
  const subTitle = req.body.subTitle;
  const tags = req.body.tags;
  const dateStart = req.body.dateStart;
  const dateEnd = req.body.dateEnd;
  const link = req.body.link;

  const newTimeline = new Timelines({
    content,
    backgroundColor,
    color,
    tags,
    dateRange,
    iconBackground,
    iconColor,
    icon,
    title,
    subTitle,
    dateStart,
    dateEnd,
    link,
  });

  newTimeline
    .save()
    .then((timeline) => res.json(timeline))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").get((req, res) => {
  Timelines.findById(req.params.id)
    .then((timeline) => res.json(timeline))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/:id").delete((req, res) => {
  Timelines.findByIdAndDelete(req.params.id)
    .then(() => res.json("Timeline deleted."))
    .catch((err) => res.status(400).json(genericErrorMsg));
});

router.route("/update/:id").post((req, res) => {
  Timelines.findById(req.params.id).then((timeline) => {
    timeline.content = req.body.content;
    timeline.color = req.body.color;
    timeline.backgroundColor = req.body.backgroundColor;
    timeline.dateRange = req.body.dateRange;
    timeline.iconBackground = req.body.iconBackground;
    timeline.iconColor = req.body.iconColor;
    timeline.icon = req.body.icon;
    timeline.title = req.body.title;
    timeline.subTitle = req.body.subTitle;
    timeline.tags = req.body.tags;
    timeline.dateStart = req.body.dateStart;
    timeline.dateEnd = req.body.dateEnd;
    timeline.link = req.body.link;

    timeline
      .save()
      .then((timeline) => res.json(timeline))
      .catch((err) => res.status(400).json("Error"));
  });
});

module.exports = router;
