const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const Schema = mongoose.Schema;

module.exports.repliesSchema = new Schema({
  _id: { type: ObjectId, default: new ObjectId() },
  text: { type: String },
  created_on: { type: Date, default: new Date() },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false },
});
