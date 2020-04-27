const mongoose = require("mongoose");

const threads = require("../models/threads.js");
const replies = require("../models/replies.js");

module.exports.get = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  Threads.find(
    { _id: thread_id },
    {
      reported: 0,
      delete_password: 0,
      "replies.delete_password": 0,
      "replies.reported": 0,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(data);
      res.json(data);
    }
  );
};

module.exports.post = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );
  let Replies = mongoose.model("Replies", replies.repliesSchema);

  let now = new Date();
  let newReplies = new Replies({
    text: req.body.text,
    created_on: now,
    delete_password: req.body.delete_password,
  });

  Threads.findOneAndUpdate(
    { _id: thread_id },
    { $set: { bumped_on: now }, $push: { replies: newReplies } },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(data);
      res.redirect(301, `/b/${req.params.board}/${req.body.thread_id}`);
    }
  );
};

module.exports.put = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  Threads.findOneAndUpdate(
    {
      _id: req.body.thread_id,
      replies: {
        $elemMatch: {
          _id: req.body.reply_id,
        },
      },
    },
    { "replies.$.reported": true },
    (err, data) => {
      if (err) {
        console.log(err);
      }

      res.text("success");
    }
  );
};

module.exports.delete = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  Threads.findOneAndUpdate(
    {
      _id: req.body.thread_id,
      replies: {
        $elemMatch: {
          _id: req.body.reply_id,
          delete_password: req.body.delete_password,
        },
      },
    },
    { "replies.$.text": "[deleted]" },
    (err, data) => {
      if (err) {
        console.log(err);
        res.text("incorrect password");
        return;
      }

      if (!data) {
        res.text("incorrect password");
      } else {
        res.text("success");
      }
    }
  );
};
