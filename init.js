"use strict";

require("babel/register")({
  optional: ["es7.classProperties"]
});

var app = require("./server/app");
module.exports = app;
app.run();
