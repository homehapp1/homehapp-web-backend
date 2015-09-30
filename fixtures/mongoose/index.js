'use strict';

import { urlName } from '../../server/lib/UrlName';
let neighborhoodsData = require('../../data/london-neighborhoods.json');

for (let neighborhood of neighborhoodsData) {
  if (typeof neighborhood.slug !== 'undefined' && neighborhood.slug) {
    continue;
  }
  neighborhood.slug = urlName(neighborhood.title);
}

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
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9094.jpg', alt: '', aspectRatio: 0.8443 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9096.jpg', alt: '', aspectRatio: 2.1757 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9097.jpg', alt: '', aspectRatio: 1 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9102.jpg', alt: '', aspectRatio: 1.8448 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9103.jpg', alt: '', aspectRatio: 2.1683 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9104.jpg', alt: '', aspectRatio: 0.763 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9108.jpg', alt: '', aspectRatio: 1.6141 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9136.jpg', alt: '', aspectRatio: 1 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9139.jpg', alt: '', aspectRatio: 1.1116 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9140.jpg', alt: '', aspectRatio: 0.7938 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9141.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9156.jpg', alt: '', aspectRatio: 1.4467 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9157.jpg', alt: '', aspectRatio: 1.4121 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9158.jpg', alt: '', aspectRatio: 0.6667 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9164.jpg', alt: '', aspectRatio: 0.7518 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9173.jpg', alt: '', aspectRatio: 1.9111 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9176.jpg', alt: '', aspectRatio: 0.6667 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9177.jpg', alt: '', aspectRatio: 0.7771 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9178.jpg', alt: '', aspectRatio: 1.8816 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9179.jpg', alt: '', aspectRatio: 1.2329 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9182.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9184.jpg', alt: '', aspectRatio: 1.1223 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9188.jpg', alt: '', aspectRatio: 1.3848 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9191.jpg', alt: '', aspectRatio: 1.1729 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9201.jpg', alt: '', aspectRatio: 1.7452 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9202.jpg', alt: '', aspectRatio: 1.0286 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9253.jpg', alt: '', aspectRatio: 0.8847 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9257.jpg', alt: '', aspectRatio: 1.1567 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9261.jpg', alt: '', aspectRatio: 0.8682 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9280.jpg', alt: '', aspectRatio: 1.5 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9283.jpg', alt: '', aspectRatio: 1.4998 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9287.jpg', alt: '', aspectRatio: 1.1859 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9293.jpg', alt: '', aspectRatio: 1.5401 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9301.jpg', alt: '', aspectRatio: 0.9691 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9306.jpg', alt: '', aspectRatio: 1.5179 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9307.jpg', alt: '', aspectRatio: 1.3606 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9310.jpg', alt: '', aspectRatio: 1.4556 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9328.jpg', alt: '', aspectRatio: 1.6685 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9330.jpg', alt: '', aspectRatio: 1.5797 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9332.jpg', alt: '', aspectRatio: 1.8638 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9339.jpg', alt: '', aspectRatio: 1.2735 },
    { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 0.9795 }
  ];

  // After the consensus of storing only width and height instead of aspect ratio
  // and using aspect ratio as a dynamic variable, convert the example images
  // to the intended measures
  for (let i = 0; i < images.length; i++) {
    images[i].width = 3000;
    images[i].height = Math.round(images[i].width / images[i].aspectRatio);
  }

  let slugs = ['S02HhBOV'];
  let slug = null;

  if (typeof slugs[index] !== 'undefined') {
    slug = slugs[index];
  } else {
    slug = 'TMP' + String('00000' + index).slice(-5);
  }

  let streets = ['Shaftesbury Avenue', 'King’s Road', 'Abbey Road', 'Carnaby Street', 'Baker Street', 'Portobello Road', 'Oxford Street', 'Piccadilly'];
  let chars = ['A', 'B', 'C', 'D', 'E', 'F'];
  let getCoords = function() {
    return [
      51.5072 + (Math.random() - 0.5),
      0.1275 + (Math.random() - 0.5)
    ]
  };

  let getLoremIpsum = function(min = 30, max = null, paragraphs = 1) {
    let lipsum = String('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat. Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi tortor magna condimentum vel, placerat id blandit sit amet tortor.').split(' ');

    if (!max) {
      max = lipsum.length;
    }

    let p = [];
    for (let i = 0; i < paragraphs; i++) {
      let content = getRandom(lipsum, randomSeed(min, max))
      .join(' ').toLowerCase()
      .replace(/\.?$/, '.')
      .replace(
        /(^|\. )([a-z])/g,
        function(match) {
          return match.toUpperCase()
        }
      );
      p.push(content);
    }
    return p.join('\n\n');
  };

  let createStoryBlock = function(template = null, properties = null, disallow = null) {
    let templates = ['BigImage', 'ContentBlock', 'Map', 'Gallery'];

    if (!template) {
      do {
        template = getRandom(templates);
      } while (template === disallow);
    }

    let storyBlock = {
      template: template,
      properties: {}
    };

    switch (template) {
      case 'BigImage':
        storyBlock.properties = {
          title: 'Nice home for lorem ipsum',
          description: getLoremIpsum(20, null, randomSeed(1, 4)),
          image: getRandom(images),
          fixed: (getRandom(0, 4)) ? false : true,
          align: getRandom(['left', 'center', 'right']),
          valign: getRandom(['top', 'middle', 'bottom']),
          gradient: getRandom([null, null, null, 'black', 'turquoise']),
        };
        break;

      case 'Gallery':
        storyBlock.properties = {
          title: randomSeed(0, 1) ? 'Gallery title' : '',
          images: getRandom(images, randomSeed(2, 15))
        };
        break;

      case 'ContentBlock':
        storyBlock.properties = {
          title: getRandom(['Story block', 'My story block', 'Great home']),
          content: getLoremIpsum()
        };
        break;

      case 'ContentImage':
        // Title length
        let s = randomSeed(2, 10);
        let l = s + randomSeed(2, 10);

        let imageTitle = getLoremIpsum(s, l);
        let imageContent = getLoremIpsum(20, null, randomSeed(1, 4));

        storyBlock.properties = {
          title: getRandom(['', imageTitle, imageTitle]),
          description: getRandom(['', imageContent, imageContent]),
          image: getRandom(images),
          imageAlign: getRandom(['left', 'right'])
        };
        break;


      case 'Map':
        let mapTitle = getLoremIpsum(5, randomSeed(10, 20));
        let mapContent = getLoremIpsum(10, randomSeed(11, 50), randomSeed(1, 3));

        storyBlock.properties = {
          // Title is optional, 33% chance that it wasn't filled
          title: getRandom('', mapTitle, mapTitle),
          description: getRandom('', mapContent, mapContent),
          coordinates: [
            51.5072 + (Math.random() - 0.5),
            0.1275 + (Math.random() - 0.5)
          ]
        };
        break;
    }

    // Random content overrides
    if (properties) {
      for (let i in properties) {
        storyBlock.properties[i] = properties[i];
      }
    }

    return storyBlock;
  };

  let neighborhoods = [
    {
      title: 'St. John`s Wood',
      slug: 'st_johns_wood'
    },
    {
      title: 'West End',
      slug: 'west_end'
    },
    {
      title: 'China Town',
      slug: 'china_town'
    },
    {
      title: 'The City',
      slug: 'the_city'
    },
    {
      title: 'South Bank',
      slug: 'south_bank'
    },
    {
      title: 'East End',
      slug: 'east_end'
    },
    {
      title: 'Westminster',
      slug: 'westminster'
    }
  ];

  for (let i = 0; i < neighborhoods.length; i++) {
    neighborhoods[i].images = getRandom(images, randomSeed(2, images.length));
    neighborhoods[i].images.location = {
      coordinates: getCoords()
    };
  }

  let getTitle = function() {
    let titles = [
      '',
      '',
      '',
      '2 rooms, kitchen, balcony and dressing room. 1 toilet + shower',
      'A very beautiful apartment',
      'Lorem ipsum',
      'A renovator\'s dream!',
      'All the services at hand',
      'Haunted house with a genuine, wailing Victorian era ghost'
    ];

    return getRandom(titles);
  };

  let property = {
    slug: slug,
    title: getTitle(),
    description: getLoremIpsum(30, null, randomSeed(1, 4)),
    location: {
      address: {
        street: getRandom(streets),
        apartment: `${randomSeed(1, 300)} ${getRandom(chars)}`,
        zipcode: '00930',
        city: 'London',
        country: 'GB'
      },
      neighborhood: getRandom(neighborhoods),
      coordinates: getCoords(),
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
      enabled: !(randomSeed(0, 3)),
      blocks: []
    },
    images: getRandom(images, randomSeed(2, 10))
  };

  let disallow = 'BigImage';
  let blockOrder = [
    {
      template: 'BigImage',
      properties: {
        align: 'center',
        valign: 'middle'
      }
    },
    {
      template: 'ContentBlock',
      properties: null
    },
    {
      template: 'Gallery',
      properties: null
    },
    {
      template: 'ContentBlock',
      properties: null
    },
    {
      template: 'BigImage',
      properties: null
    }
  ];

  for (let i = 0; i < blockOrder.length; i++) {
    property.story.blocks.push(createStoryBlock(blockOrder[i].template, blockOrder[i].properties));

    // Allow some randomness and create a left/right content block
    if (Math.random() < 0.3) {
      // For random testing of left/right alignment
      let r = randomSeed(0, 1);
      for (let n = 0; n < randomSeed(1, 2); n++) {
        let properties = {
          // Some randomness, but prevent two consecutive alignments on the same side
          imageAlign: (n % 2 + r) ? 'left' : 'right'
        };
        property.story.blocks.push(createStoryBlock('ContentImage', properties))
      }
    }
  }

  // property.story.blocks.push(createStoryBlock('BigImage', {align: 'center', valign: 'middle'}));
  //
  // for (let i = 0; i < randomSeed(2, 5); i++) {
  //   let block = createStoryBlock(null, null, disallow);
  //   disallow = block.template;
  //   property.story.blocks.push(block);
  // }

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
  let Neighborhood = db.getModel('Neighborhood');
  let City = db.getModel('City');

  let admin = null;
  let adminUsername = 'administrator@homehapp.com';

  let city = null;

  function createOrUpdateAdmin() {
    return new Promise((resolve, reject) => {
      User.findOne({username: adminUsername}).execAsync()
      .then((model) => {
        console.log('Got user', model);
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
        console.error('Caught error', err);
        reject(err);
      });
    });
  }

  function createOrUpdateLondon() {
    return new Promise((resolve, reject) => {
      City.findOne({title: 'London'}).execAsync()
      .then((model) => {
        console.log('Got city', model);
        if (model) {
          city = model;
          return resolve();
        }
        city = new City({
          slug: 'london',
          title: 'London',
          location: {
            country: 'Great Britain',
            coordinates: [
              51.5073509,
              -0.1277583
            ]
          },
          createdBy: admin.id
        });
        city.saveAsync()
        .spread(function(model, numAffected) {
          console.log('Created city', model);
          resolve();
        })
        .catch((err) => {
          console.error('error while creating the main city', err);
          reject(err);
        });
      })
      .catch((err) => {
        console.error('Caught error', err);
        reject(err);
      });
    });
  }

  return createOrUpdateAdmin()
    .then(() => {
      return createOrUpdateLondon();
    })
    .then(() => {
      if (!version || version === 0) {
        neighborhoodsData.forEach((neighborhoodData) => {
          tasks.push(
            new Promise((resolve, reject) => {
              Neighborhood.findOne({
                slug: neighborhoodData.slug
              })
              .execAsync()
              .then((model) => {
                if (model) {
                  Neighborhood.findByIdAndUpdate(model.id, {
                    $set: neighborhoodData
                  }).execAsync()
                  .then(function(model) {
                    resolve();
                  })
                  .catch((err) => {
                    console.error('error while updating neighborhood', err);
                    reject(err);
                  });
                  return;
                }

                let neighborhood = new Neighborhood(neighborhoodData);
                neighborhood.createdBy = admin.id;
                neighborhood.location.city = city.id;

                neighborhood.saveAsync()
                .spread(function(model, numAffected) {
                  console.log('Created neighborhood', neighborhood.title);
                  resolve();
                })
                .catch((err) => {
                  console.error('error while creating neighborhood', err);
                  reject(err);
                });
              })
              .catch((err) => {
                console.error('caught error while working on neighborhoods', err);
              });
            })
          );
        });

        demoHomes.forEach((homeData) => {
          tasks.push(
            new Promise((resolve, reject) => {
              Home.findOne({
                slug: homeData.slug
              })
              .execAsync()
              .then((model) => {
                //console.log('got exiting home', model);
                if (model) {
                  Home.findByIdAndUpdate(model.id, {
                    $set: homeData
                  }).execAsync()
                  .then(function(model) {
                    console.log('Updated home', home.title);
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
                  console.log('Created home', home.title);
                  resolve();
                })
                .catch((err) => {
                  console.error('error while creating home', err);
                  reject(err);
                });
              })
              .catch((err) => {
                console.error('caught error while working on homes', err);
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
