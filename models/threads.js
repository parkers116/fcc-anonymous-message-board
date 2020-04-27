const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const Schema = mongoose.Schema;

const replies = require("./replies.js");

module.exports.threadsSchema = new Schema(
  {
    _id: { type: ObjectId, default: new ObjectId() },
    text: { type: String, required: true },
    created_on: { type: Date, default: new Date() },
    bumped_on: { type: Date, default: new Date() },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true },
    replies: [replies.repliesSchema],
  }
  // { collection: "Threads" }
);
