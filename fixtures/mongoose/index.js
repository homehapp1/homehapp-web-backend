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
    { url: 'contentMockup/DSCF9094.jpg', alt: '', aspectRatio: 0.8443 },
    { url: 'contentMockup/DSCF9096.jpg', alt: '', aspectRatio: 2.1757 },
    { url: 'contentMockup/DSCF9097.jpg', alt: '', aspectRatio: 1 },
    { url: 'contentMockup/DSCF9102.jpg', alt: '', aspectRatio: 1.8448 },
    { url: 'contentMockup/DSCF9103.jpg', alt: '', aspectRatio: 2.1683 },
    { url: 'contentMockup/DSCF9104.jpg', alt: '', aspectRatio: 0.763 },
    { url: 'contentMockup/DSCF9108.jpg', alt: '', aspectRatio: 1.6141 },
    { url: 'contentMockup/DSCF9136.jpg', alt: '', aspectRatio: 1 },
    { url: 'contentMockup/DSCF9139.jpg', alt: '', aspectRatio: 1.1116 },
    { url: 'contentMockup/DSCF9140.jpg', alt: '', aspectRatio: 0.7938 },
    { url: 'contentMockup/DSCF9141.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9156.jpg', alt: '', aspectRatio: 1.4467 },
    { url: 'contentMockup/DSCF9157.jpg', alt: '', aspectRatio: 1.4121 },
    { url: 'contentMockup/DSCF9158.jpg', alt: '', aspectRatio: 0.6667 },
    { url: 'contentMockup/DSCF9164.jpg', alt: '', aspectRatio: 0.7518 },
    { url: 'contentMockup/DSCF9173.jpg', alt: '', aspectRatio: 1.9111 },
    { url: 'contentMockup/DSCF9176.jpg', alt: '', aspectRatio: 0.6667 },
    { url: 'contentMockup/DSCF9177.jpg', alt: '', aspectRatio: 0.7771 },
    { url: 'contentMockup/DSCF9178.jpg', alt: '', aspectRatio: 1.8816 },
    { url: 'contentMockup/DSCF9179.jpg', alt: '', aspectRatio: 1.2329 },
    { url: 'contentMockup/DSCF9182.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9184.jpg', alt: '', aspectRatio: 1.1223 },
    { url: 'contentMockup/DSCF9188.jpg', alt: '', aspectRatio: 1.3848 },
    { url: 'contentMockup/DSCF9191.jpg', alt: '', aspectRatio: 1.1729 },
    { url: 'contentMockup/DSCF9201.jpg', alt: '', aspectRatio: 1.7452 },
    { url: 'contentMockup/DSCF9202.jpg', alt: '', aspectRatio: 1.0286 },
    { url: 'contentMockup/DSCF9253.jpg', alt: '', aspectRatio: 0.8847 },
    { url: 'contentMockup/DSCF9257.jpg', alt: '', aspectRatio: 1.1567 },
    { url: 'contentMockup/DSCF9261.jpg', alt: '', aspectRatio: 0.8682 },
    { url: 'contentMockup/DSCF9280.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'contentMockup/DSCF9283.jpg', alt: '', aspectRatio: 1.4998 },
    { url: 'contentMockup/DSCF9287.jpg', alt: '', aspectRatio: 1.1859 },
    { url: 'contentMockup/DSCF9293.jpg', alt: '', aspectRatio: 1.5401 },
    { url: 'contentMockup/DSCF9301.jpg', alt: '', aspectRatio: 0.9691 },
    { url: 'contentMockup/DSCF9306.jpg', alt: '', aspectRatio: 1.5179 },
    { url: 'contentMockup/DSCF9307.jpg', alt: '', aspectRatio: 1.3606 },
    { url: 'contentMockup/DSCF9310.jpg', alt: '', aspectRatio: 1.4556 },
    { url: 'contentMockup/DSCF9328.jpg', alt: '', aspectRatio: 1.6685 },
    { url: 'contentMockup/DSCF9330.jpg', alt: '', aspectRatio: 1.5797 },
    { url: 'contentMockup/DSCF9332.jpg', alt: '', aspectRatio: 1.8638 },
    { url: 'contentMockup/DSCF9339.jpg', alt: '', aspectRatio: 1.2735 },
    { url: 'contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 0.9795 }
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
