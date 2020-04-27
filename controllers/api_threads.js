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
    }
  )
    .sort({ bumped_on: -1 })
    .limit(10)
    .exec((err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(data);
      res.json(data);
    });
};

module.exports.post = (req, res) => {
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

    res.redirect(301, `/b/${req.params.board}`);
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

  Threads.deleteOne(
    { _id: req.body.thread_id, delete_password: req.body.delete_password },
    (err, data) => {
      if (err) {
        console.log(err);
        res.send("incorrect password");
        return;
      }

      if (data.ok) {
        res.send("success");
      } else {
        res.send("incorrect password");
      }
    }
  );
};
