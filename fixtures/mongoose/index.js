"use strict";

exports.execute = function execute(migrator) {
  let app = migrator.app;
  let version = migrator.version;
  let db = app.db;
  let tasks = [];

  let User = db.getModel("User");

  let admin = null;

  if (!version || version === 0) {
    tasks.push(
      new Promise((resolve, reject) => {
        User.findOne({username: "administrator@homehapp.co.uk"}).execAsync()
        .then((model) => {
          //console.log("got model", model);
          if (model) {
            admin = model;
            return resolve();
          }
          admin = new User({
            givenName: "Homehapp",
            familyName: "Administrator",
            username: "administrator@homehapp.co.uk",
            email: "jerry.jalava@iki.fi",
            password: "admin123",
            active: true,
            _accessLevel: "admin"
          });
          admin.saveAsync()
          .spread(function(model, numAffected) {
            //console.log("Created admin user",admin);
            resolve();
          })
          .catch((err) => {
            console.error("error while creating admin user", err);
            reject(err);
          });
        })
        .catch((err) => {
          console.error("catched error", err);
          reject(err);
        });
      })
    );
  }

  return Promise.all(tasks).then(() => {
    console.log("All fixture tasks executed");
  });
};
