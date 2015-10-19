

exports.configure = function(app, config) {
  return new Promise((resolve, reject) => {
    let instance = null;
    try {
      let Adapter = require(`./adapters/${config.adapter}`);
      instance = new Adapter(app, config.adapterConfig);
    } catch (err) {
      return reject(err);
    }
    app.cdn = instance;
    resolve();
  });
};
