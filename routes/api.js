/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const api_threads = require("../controllers/api_threads.js");
const api_replies = require("../controllers/api_replies.js");

var expect = require("chai").expect;

module.exports = function (app) {
  app
    .route("/api/threads/:board")
    .get(api_threads.get)
    .post(api_threads.post)
    .put(api_threads.put)
    .delete(api_threads.delete);

  app
    .route("/api/replies/:board")
    .get(api_replies.get)
    .post(api_replies.post)
    .put(api_replies.put)
    .delete(api_replies.delete);
};
