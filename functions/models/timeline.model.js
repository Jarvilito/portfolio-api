const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timelinesSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    color: { type: String, required: true },
    dateRange: { type: String, required: true },
    iconBackground: { type: String, required: true },
    tags: { type: Array, required: false },
    iconColor: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    link: { type: Object, required: false },
  },
  {
    timestamps: true,
  }
);

const Timelines = mongoose.model("Timelines", timelinesSchema);

module.exports = Timelines;
