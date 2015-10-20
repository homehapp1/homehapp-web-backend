let populate = function populate(migrator) {
  return migrator.getFixtureData().execute(migrator);
};

module.exports = {
  populate: populate
};
