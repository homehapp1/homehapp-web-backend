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
    { url: 'v10/contentMockup/DSCF9094.jpg', alt: '', aspectRatio: 0.8443 },
    { url: 'v10/contentMockup/DSCF9096.jpg', alt: '', aspectRatio: 2.1757 },
    { url: 'v10/contentMockup/DSCF9097.jpg', alt: '', aspectRatio: 1 },
    { url: 'v10/contentMockup/DSCF9102.jpg', alt: '', aspectRatio: 1.8448 },
    { url: 'v10/contentMockup/DSCF9103.jpg', alt: '', aspectRatio: 2.1683 },
    { url: 'v10/contentMockup/DSCF9104.jpg', alt: '', aspectRatio: 0.763 },
    { url: 'v10/contentMockup/DSCF9108.jpg', alt: '', aspectRatio: 1.6141 },
    { url: 'v10/contentMockup/DSCF9136.jpg', alt: '', aspectRatio: 1 },
    { url: 'v10/contentMockup/DSCF9139.jpg', alt: '', aspectRatio: 1.1116 },
    { url: 'v10/contentMockup/DSCF9140.jpg', alt: '', aspectRatio: 0.7938 },
    { url: 'v10/contentMockup/DSCF9141.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'v10/contentMockup/DSCF9156.jpg', alt: '', aspectRatio: 1.4467 },
    { url: 'v10/contentMockup/DSCF9157.jpg', alt: '', aspectRatio: 1.4121 },
    { url: 'v10/contentMockup/DSCF9158.jpg', alt: '', aspectRatio: 0.6667 },
    { url: 'v10/contentMockup/DSCF9164.jpg', alt: '', aspectRatio: 0.7518 },
    { url: 'v10/contentMockup/DSCF9173.jpg', alt: '', aspectRatio: 1.9111 },
    { url: 'v10/contentMockup/DSCF9176.jpg', alt: '', aspectRatio: 0.6667 },
    { url: 'v10/contentMockup/DSCF9177.jpg', alt: '', aspectRatio: 0.7771 },
    { url: 'v10/contentMockup/DSCF9178.jpg', alt: '', aspectRatio: 1.8816 },
    { url: 'v10/contentMockup/DSCF9179.jpg', alt: '', aspectRatio: 1.2329 },
    { url: 'v10/contentMockup/DSCF9182.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'v10/contentMockup/DSCF9184.jpg', alt: '', aspectRatio: 1.1223 },
    { url: 'v10/contentMockup/DSCF9188.jpg', alt: '', aspectRatio: 1.3848 },
    { url: 'v10/contentMockup/DSCF9191.jpg', alt: '', aspectRatio: 1.1729 },
    { url: 'v10/contentMockup/DSCF9201.jpg', alt: '', aspectRatio: 1.7452 },
    { url: 'v10/contentMockup/DSCF9202.jpg', alt: '', aspectRatio: 1.0286 },
    { url: 'v10/contentMockup/DSCF9253.jpg', alt: '', aspectRatio: 0.8847 },
    { url: 'v10/contentMockup/DSCF9257.jpg', alt: '', aspectRatio: 1.1567 },
    { url: 'v10/contentMockup/DSCF9261.jpg', alt: '', aspectRatio: 0.8682 },
    { url: 'v10/contentMockup/DSCF9280.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'v10/contentMockup/DSCF9283.jpg', alt: '', aspectRatio: 1.4998 },
    { url: 'v10/contentMockup/DSCF9287.jpg', alt: '', aspectRatio: 1.1859 },
    { url: 'v10/contentMockup/DSCF9293.jpg', alt: '', aspectRatio: 1.5401 },
    { url: 'v10/contentMockup/DSCF9301.jpg', alt: '', aspectRatio: 0.9691 },
    { url: 'v10/contentMockup/DSCF9306.jpg', alt: '', aspectRatio: 1.5179 },
    { url: 'v10/contentMockup/DSCF9307.jpg', alt: '', aspectRatio: 1.3606 },
    { url: 'v10/contentMockup/DSCF9310.jpg', alt: '', aspectRatio: 1.4556 },
    { url: 'v10/contentMockup/DSCF9328.jpg', alt: '', aspectRatio: 1.6685 },
    { url: 'v10/contentMockup/DSCF9330.jpg', alt: '', aspectRatio: 1.5797 },
    { url: 'v10/contentMockup/DSCF9332.jpg', alt: '', aspectRatio: 1.8638 },
    { url: 'v10/contentMockup/DSCF9339.jpg', alt: '', aspectRatio: 1.2735 },
    { url: 'v10/contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 0.9795 }
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

  let createStoryBlock = function(template = null, properties = null, disallow = null) {
    let templates = ['BigImage', 'ContentBlock', 'Map', 'Gallery'];
    while (template === disallow) {
      if (!template) {
        template = getRandom(templates);
      }
    }

    let storyBlock = {
      template: template,
      properties: {}
    };
    let lipsum = String('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat. Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi tortor magna condimentum vel, placerat id blandit sit amet tortor.').split(' ');

    switch (template) {
      case 'BigImage':
        storyBlock.properties = {
          title: 'Nice home for lorem ipsum',
          image: getRandom(images),
          fixed: (getRandom(0, 4)) ? false : true,
          align: getRandom(['left', 'center', 'right']),
          valign: getRandom(['top', 'middle', 'bottom']),
          gradient: getRandom([null, null, null, 'black', 'turquoise']),
        }
        break;
      case 'Gallery':
        storyBlock.properties = {
          title: randomSeed(0, 1) ? 'Gallery title' : '',
          images: getRandom(images, randomSeed(2, images.length))
        }
        break;
      case 'ContentBlock':
        storyBlock.properties = {
          title: getRandom(['Story block', 'My story block', 'Great home']),
          content: getRandom(lipsum, randomSeed(30, lipsum.length))
          .join(' ').toLowerCase()
          .replace(/\.?$/, '.')
          .replace(
            /(^|\. )([a-z])/g,
            function(match) {
              return match.toUpperCase()
            }
          )
        }
    }

    if (properties) {
      for (let i in properties) {
        storyBlock.properties[i] = properties[i];
      }
    }

    return storyBlock;
  };

  let property = {
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
      blocks: []
    },
    images: getRandom(images, randomSeed(2, 10))
  };

  property.story.blocks.push(createStoryBlock('BigImage', {align: 'center', valign: 'middle'}));
  let disallow = 'BigImage';

  for (let i = 0; i < randomSeed(1, 10); i++) {
    let block = createStoryBlock(null, null, disallow);
    disallow = block.template;
    property.story.blocks.push(block);
  }

  return property;
};

let demoHomes = [];

for (let i = 0; i < 30; i++) {
  let h = createHome(i);
  demoHomes.push(h);
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
