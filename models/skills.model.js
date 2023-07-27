const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const skillsSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    icon: { type: String, required: true },
    rate: { type: Number, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Skills = mongoose.model("Skills", skillsSchema);

module.exports = Skills;
