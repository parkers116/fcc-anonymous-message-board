const mongoose = require("mongoose");

const threads = require("../models/threads.js");

module.exports.get = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  Threads.find(
    {},
    {
      reported: 0,
      delete_password: 0,
      "replies.delete_password": 0,
      "replies.reported": 0,
      __v: 0,
    }
  )
    .sort({ bumped_on: -1 })
    .limit(10)
    .lean()
    .exec((err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      data = data.map((item) => {
        let replycount = item.replies.length;
        item.replies = item.replies.slice(-3);
        return Object.assign({}, item, { replycount: replycount });
      });

      res.json(data);
    });
};

module.exports.post = (req, res) => {
  let board = req.params.board;
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  let newThreads = new Threads({
    text: req.body.text,
    delete_password: req.body.delete_password,
  });

  newThreads.save((err) => {
    if (err) {
      console.log(err);
      return;
    }

    res.redirect(302, `/b/${req.params.board}/`);
  });
};

module.exports.put = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  Threads.findOneAndUpdate(
    { _id: req.body.thread_id },
    { reported: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }

      res.send("success");
    }
  );
};

module.exports.delete = (req, res) => {
  let Threads = mongoose.model(
    "Threads",
    threads.threadsSchema,
    req.params.board
  );

  Threads.deleteOne(
    { _id: req.body.thread_id, delete_password: req.body.delete_password },
    (err, data) => {
      if (err) {
        console.log(err);
        res.send("incorrect password");
        return;
      }

      if (data.ok && data.deletedCount === 1) {
        res.send("success");
      } else {
        res.send("incorrect password");
      }
    }
  );
};
