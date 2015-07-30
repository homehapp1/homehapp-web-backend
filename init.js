"use strict";

require("babel/register")({
  optional: ["es7.classProperties"]
});

var projectName = "site";
if (process.argv.length > 2) {
  projectName = process.argv[2];
}
if (process.env.PROJECT_NAME && process.env.PROJECT_NAME !== "undefined") {
  projectName = process.env.PROJECT_NAME;
}

var app = require("./server/app");
module.exports = app;
app.run(projectName);
