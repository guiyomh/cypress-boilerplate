<!--
 Copyright 2019 Guillaume Camus
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->
[![CircleCI](https://circleci.com/gh/guiyomh/cypress-boilerplate/tree/master.svg?style=svg)](https://circleci.com/gh/guiyomh/cypress-boilerplate/tree/master) 
[![Build Status](https://travis-ci.org/guiyomh/cypress-boilerplate.svg?branch=master)](https://travis-ci.org/guiyomh/cypress-boilerplate)
[![codecov](https://codecov.io/gh/guiyomh/cypress-boilerplate/branch/master/graph/badge.svg)](https://codecov.io/gh/guiyomh/cypress-boilerplate)

# Cypress-boilerplate

Cypress boilerplate is a starter kit to help you to create end to end test

## Tech

Cypress-boilerplate uses a number of open source projects to work properly:

* node.js - evented I/O for the backend
* Mocha - simple, flexible, fun javascript test framework for node.js & the browser 
* Cypress - Fast, easy and reliable testing for anything that runs in a browser.

And of course Cypress-boilerplate itself is open source with a public repository

## Installation

Cypress boilerplate requires [Node.js](https://nodejs.org/) v10.15+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ git clone https://github.com/guiyomh/cypress-boilerplate.git
$ cd cypress-boilerplate
$ npm run setup
```
## Plugins

| Plugin                        |
|-------------------------------|
| cypress-cucumber-preprocessor |
| cypress-multi-reporters       |
| cypress-visual-regression"    |

## Usage

```sh
$ node ./cypress/runner.js --help

This command run cypress end to end tests

Usage: runner.js [options]

Options:
  --version, -V      Affiche le numéro de version                      [booléen]
  -h, --help         Affiche de l'aide                                 [booléen]
  --baseUrl, -u      The target url where the tests are run             [requis]
  --browser, -b      The browser                     [requis] [défaut: "chrome"]
  --concurrency, -c  The number of tests run in parallel             [défaut: 1]
```
## License

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
