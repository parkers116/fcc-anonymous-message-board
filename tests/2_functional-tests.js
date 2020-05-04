/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("API ROUTING FOR /api/threads/:board", function () {
    suite("POST", function () {
      test("POST", function (done) {
        let target_board = "test";
        chai
          .request(server)
          .post("/api/threads/test")
          .send({
            board: target_board,
            text: "testing",
            delete_password: "testing",
          })
          .redirects(0)
          .end(function (err, res) {
            assert.equal(res.status, 302);
            assert.equal(res.headers.location, `/b/${target_board}/`);
            done();
          });
      });
    });

    suite("GET", function () {
      test("GET", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "replies");
            assert.property(res.body[0], "replycount");
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "_id");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_passwords");
            done();
          });
      });
    });

    suite("PUT", function () {
      test("DELETE FAIL (WRONG PASSWORD)", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let delete_id = res.body[0]._id;
            chai
              .request(server)
              .put("/api/threads/test")
              .query({ report_id: delete_id })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, "success");
                done();
              });
          });
      });
    });
    suite("DELETE", function () {
      test("DELETE SUCCESS", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let delete_id = res.body[0]._id;
            let delete_pw = res.body[0].text;
            chai
              .request(server)
              .delete("/api/threads/test")
              .send({ thread_id: delete_id, delete_password: delete_pw })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, "success");
                done();
              });
          });
      });

      test("DELETE FAIL (WRONG PASSWORD)", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let delete_id = res.body[0]._id;
            chai
              .request(server)
              .delete("/api/threads/test")
              .query({ thread_id: delete_id, delete_password: "noThisPW" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, "incorrect password");
                done();
              });
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function () {
    suite("POST", function () {
      test("POST", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let id = res.body[0]._id;
            chai
              .request(server)
              .post("/api/replies/test")
              .send({
                thread_id: id,
                text: "test reply",
                delete_password: "test reply",
              })
              .redirects(0)
              .end(function (err, res) {
                assert.equal(res.status, 302);
                done();
              });
          });
      });
    });

    suite("GET", function () {
      test("GET", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let id = res.body[0]._id;
            chai
              .request(server)
              .get("/api/replies/test")
              .query({
                thread_id: id,
              })
              .end(function (err, res) {
                // assert.equal(res.status, 200);
                assert.property(res.body, "bumped_on");
                assert.property(res.body, "created_on");
                assert.property(res.body, "replies");
                assert.property(res.body, "text");
                assert.property(res.body, "_id");
                done();
              });
          });
      });
    });

    suite("PUT", function () {
      test("GET", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let id = res.body[0]._id;
            chai
              .request(server)
              .put("/api/replies/test")
              .query({
                thread_id: id,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                done();
              });
          });
      });
    });

    suite("DELETE", function () {
      test("DELETE SUCCESS", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let threadid = res.body[0]._id;
            let replyid = res.body[0].replies[0]._id;
            let replypw = "test reply";
            chai
              .request(server)
              .delete("/api/replies/test")
              .send({
                thread_id: threadid,
                reply_id: replyid,
                delete_password: replypw,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, "success");
                done();
              });
          });
      });

      test("DELETE FAIL (WRONG PASSWORD)", function (done) {
        chai
          .request(server)
          .get("/api/threads/test")
          .end(function (err, res) {
            let threadid = res.body[0]._id;
            let replyid = res.body[0].replies[0]._id;
            let replypw = "noThisPW";
            chai
              .request(server)
              .delete("/api/replies/test")
              .send({
                thread_id: threadid,
                reply_id: replyid,
                delete_password: replypw,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, "incorrect password");
                done();
              });
          });
      });
    });
  });
});
