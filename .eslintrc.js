module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "cypress",
    "chai-friendly",
    "jest",
    "flowtype",
  ],
  "env": {
    "browser": true,
    "es6": true,
    "cypress/globals": true,
    "jest/globals": true,
  },
  "extends": [
    "airbnb-base",
    "plugin:cypress/recommended",
    "plugin:flowtype/recommended",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2,
  }
};
