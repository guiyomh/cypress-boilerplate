const cucumber = require('cypress-cucumber-preprocessor').default;
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');

module.exports = (on) => {
  on('file:preprocessor', cucumber());
  getCompareSnapshotsPlugin(on);
};
