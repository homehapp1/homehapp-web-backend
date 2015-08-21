'use strict';
let getRandom = function (arr, l = 0) {
  if (l) {
    l = Math.min(arr.length, l);
    let rval = [];
    let i = 0;

    while (rval.length < l) {
      let opt = getRandom(arr);
      if (rval.indexOf(opt) === -1) {
        rval.push(opt);
      }

      i++;

      // Overflow protection and throttling
      if (i > 100) {
        break;
      }
    }
    return rval;
  }

  let seed = randomSeed(0, arr.length);
  return arr[seed];
};

let randomSeed = function(min, max, precision = 0) {
  if (precision) {
    return Number((min + max * Math.random()).toFixed(precision));
  }

  return min + Math.floor(max * Math.random());
};

let createHome = function(index)
{
  let images = [
    { url: 'contentMockup/DSCF9095.jpg', alt: '', aspectRatio: 0.6 },
    { url: 'contentMockup/DSCF9097.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9102.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9103.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9105.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9108.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9111.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9141.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9144.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9155.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9156.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9158.jpg', alt: '', aspectRatio: 0.6 },
    { url: 'contentMockup/DSCF9160.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9177.jpg', alt: '', aspectRatio: 0.6 },
    { url: 'contentMockup/DSCF9178.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9184.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9188.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9201.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9225.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9227.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9230.jpg', alt: '', aspectRatio: 0.6 },
    { url: 'contentMockup/DSCF9245.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9253.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9257.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9261.jpg', alt: '', aspectRatio: 0.6 },
    { url: 'contentMockup/DSCF9272.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9280.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9299.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9301.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9306.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9310.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9328.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9339.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 1.5 }
  ];

  let slugs = ['S02HhBOV'];
  let slug = null;

  if (typeof slugs[index] !== 'undefined') {
    slug = slugs[index];
  } else {
    slug = 'TMP' + String('00000' + index).slice(-5);
  }

  let streets = ['Shaftesbury Avenue', 'King’s Road', 'Abbey Road', 'Carnaby Street', 'Baker Street', 'Portobello Road', 'Oxford Street', 'Piccadilly'];
  let chars = ['A', 'B', 'C', 'D', 'E', 'F'];

  return {
    slug: slug,
    description: '2 rooms, kitchen, balcony and dressing room. 1 toilet + shower',
    location: {
      address: {
        street: getRandom(streets),
        apartment: `${randomSeed(1, 300)} ${getRandom(chars)}`,
        zipcode: '00930',
        city: 'London',
        country: 'GB'
      },
      coordinates: [
        51.5072 + (Math.random() - 0.5),
        0.1275 + (Math.random() - 0.5)
      ]
    },
    costs: {
      currency: 'EUR',
      sellingPrice: Math.round(Math.random() * 100) * 100000
    },
    amenities: [
      'Concierge Service'
    ],
    facilities: [
      'Shared Sauna'
    ],
    attributes: [
      { name: 'rooms', value: randomSeed(1, 5) },
      { name: 'floor', value: randomSeed(1, 30) },
      { name: 'elevator', value: (randomSeed(0, 1)) ? 'yes' : 'no' }
    ],
    story: {
      enabled: true,
      blocks: [
        {
          template: 'introImage',
          properties: {
            title: 'Nice home for small family',
            image: 'v1439796815/contentMockup/DSCF9347.jpg'
          }
        }
      ]
    },
    images: getRandom(images, randomSeed(2, 10))
  };
};

let demoHomes = [];

for (let i = 0; i < 30; i++) {
  demoHomes.push(createHome(i));
}

exports.execute = function execute(migrator) {
  let app = migrator.app;
  let version = migrator.version;
  let db = app.db;
  let tasks = [];

  let User = db.getModel('User');
  let Home = db.getModel('Home');

  let admin = null;
  let adminUsername = 'administrator@homehapp.com';

  function createOrUpdateAdmin() {
    return new Promise((resolve, reject) => {
      User.findOne({username: adminUsername}).execAsync()
      .then((model) => {
        console.log('got model', model);
        if (model) {
          admin = model;
          return resolve();
        }
        admin = new User({
          givenName: 'Homehapp',
          familyName: 'Administrator',
          username: adminUsername,
          email: adminUsername,
          password: 'admin123',
          active: true,
          _accessLevel: 'admin'
        });
        admin.saveAsync()
        .spread(function(model, numAffected) {
          console.log('Created admin user', admin);
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
    });
  }

  return createOrUpdateAdmin()
    .then(() => {
      if (!version || version === 0) {
        demoHomes.forEach((homeData) => {
          tasks.push(
            new Promise((resolve, reject) => {
              Home.findOne({
                slug: homeData.slug
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
                  return;
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
    });
};
