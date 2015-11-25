"use strict";

import should from "should";
import request from "supertest";

import testUtils from "../utils";

var app = null;

describe("Default routes without authentication", () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      done(err);
    });
  });

  it("Should not respond to / path", (done) => {
    request(app)
    .get("/")
    .expect(302)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

});
