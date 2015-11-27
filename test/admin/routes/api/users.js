"use strict";

import should from "should";
import request from "supertest";

import testUtils from "../../utils";

var app = null;

// describe("User routes without authentication", () => {
//   before((done) => {
//     testUtils.createApp((err, appInstance) => {
//       app = appInstance;
//       done(err);
//     });
//   });
//
//   it("Should respond to /api/users path", (done) => {
//     request(app)
//     .get("/api/users")
//     .expect(200)
//     .end((err, res) => {
//       should.not.exist(err);
//       done();
//     });
//   });
//
//   it("Should receive list from /api/users", (done) => {
//     request(app)
//     .get("/api/users")
//     .expect(200)
//     .end((err, res) => {
//       should.not.exist(err);
//       res.body.status.should.equal("ok");
//       res.body.should.have.property("users");
//       res.body.users.should.be.instanceof(Array);
//       done();
//     });
//   });
// });
