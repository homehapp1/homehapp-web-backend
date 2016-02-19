import {toTitleCase} from '../Helpers';

exports.configure = function(app, config) {
  return new Promise((resolve, reject) => {
    let adapterClassName = `${toTitleCase(config.adapter)}Adapter`;
    let DatabaseAdapter = require(`./${adapterClassName}`);
    let instance = new DatabaseAdapter(app, config.adapterConfig);

    app.db = instance;
    instance.connect(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};
