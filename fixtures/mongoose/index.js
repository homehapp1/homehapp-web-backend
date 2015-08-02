'use strict';

const DEMO_HOMES = [
  {
    description: '2 rooms, kitchent, balcony and dressing room. 1 toilet + shower',
    location: {
      address: {
        street: 'Kauppakartanonkuja 3 B',
        apartment: '22',
        zipcode: '00930',
        city: 'Helsinki',
        country: 'FI'
      },
      coordinates: [
        60.2072733, 25.0765564
      ]
    },
    price: 220000,
    currency: 'EUR',
    attributes: [
      { name: 'rooms', value: 2 },
      { name: 'floor', value: 3 },
      { name: 'elevator', value: 'no' }
    ],
    story: {
      enabled: true,
      blocks: [
        {
          template: 'introImage',
          properties: {
            title: 'Nice home for small family',
            image: 'http://res.cloudinary.com/kaktus/image/upload/c_scale,q_60,w_1920/v1436955433/DSCF9129_vkms23.jpg'
          }
        }
      ]
    }
  }
];

exports.execute = function execute(migrator) {
  let app = migrator.app;
  let version = migrator.version;
  let db = app.db;
  let tasks = [];

  let User = db.getModel('User');
  let Home = db.getModel('Home');

  let admin = null;

  if (!version || version === 0) {
    tasks.push(
      new Promise((resolve, reject) => {
        User.findOne({username: 'administrator@homehapp.co.uk'}).execAsync()
        .then((model) => {
          //console.log('got model', model);
          if (model) {
            admin = model;
            return resolve();
          }
          admin = new User({
            givenName: 'Homehapp',
            familyName: 'Administrator',
            username: 'administrator@homehapp.co.uk',
            email: 'jerry.jalava@iki.fi',
            password: 'admin123',
            active: true,
            _accessLevel: 'admin'
          });
          admin.saveAsync()
          .spread(function(model, numAffected) {
            //console.log('Created admin user',admin);
            resolve();
          })
          .catch((err) => {
            console.error('error while creating admin user', err);
            reject(err);
          });
        })
        .catch((err) => {
          console.error('catched error', err);
          reject(err);
        });
      })
    );

    DEMO_HOMES.forEach((homeData) => {
      tasks.push(
        new Promise((resolve, reject) => {
          Home.findOne({
            'location.address.street': homeData.location.address.street
          }).execAsync()
          .then((model) => {
            //console.log('got exiting home', model);
            if (model) {
              Home.findByIdAndUpdate(model.id, {
                $set: homeData
              }).execAsync()
              .then(function(model) {
                //console.log('Updated home', home);
                resolve();
              })
              .catch((err) => {
                console.error('error while updating home', err);
                reject(err);
              });
            }

            let home = new Home(homeData);
            home.createdBy = admin.id;

            home.saveAsync()
            .spread(function(model, numAffected) {
              //console.log('Created home', home);
              resolve();
            })
            .catch((err) => {
              console.error('error while creating home', err);
              reject(err);
            });
          })
          .catch((err) => {
            console.error('catched error', err);
            reject(err);
          });
        })
      );
    });
  }

  return Promise.all(tasks).then(() => {
    console.log('All fixture tasks executed');
  });
};
