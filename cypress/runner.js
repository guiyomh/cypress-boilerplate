/* eslint-disable no-console */
// Copyright 2019 Guillaume Camus
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const {
  of,
  throwError,
  defer,
} = require('rxjs');
const {
  flatMap,
  map,
  toArray,
  retry,
  catchError,
} = require('rxjs/operators');
const cypress = require('cypress');
const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const chalk = require('chalk');
const marge = require('mochawesome-report-generator');

const { argv } = require('yargs').usage('This command run cypress end to end tests\n\nUsage: $0 [options]')
  .version('version', '0.1.0').alias('version', 'V')
  .help('h')
  .alias('h', 'help')
  .options({
    baseUrl: {
      alias: 'u',
      description: 'The target url where the tests are run',
      required: true,
    },
    width: {
      description: 'the viewport width',
      required: true,
      default: 1920,
    },
    height: {
      description: 'the viewport height',
      required: true,
      default: 1080,
    },
    browser: {
      alias: 'b',
      description: 'The browser',
      required: true,
      default: 'chrome',
    },
    concurrency: {
      alias: 'c',
      description: 'The number of tests run in parallel',
      default: 1,
    },
  });
const addContext = require('./addContext');
const mergeReports = require('./mergeReports');
const cypressConfig = require('../cypress.json');
const addCucumber = require('./addCucumber');


const flatten = a => [].concat(...a);
const getVideoPath = filePath => path.resolve(__dirname, `videos_${path.basename(filePath, path.extname(filePath))}`);
const getScreenshotPath = filePath => path.resolve(__dirname, `screenshots_${path.basename(filePath, path.extname(filePath))}`);

const files = flatten(
  (argv._.length ? argv._ : ['**/*.{spec.js,feature}']).map(f => glob.sync(path.resolve(__dirname, 'integration', f))),
);
// .filter(f => /\.[a-z]{1,6}$/.test(f));

const assetPath = argv.assetPath || '';
const baseUrl = argv.baseUrl || cypressConfig.baseUrl;

const concurrency = parseInt(argv.concurrency, 10) || 1;
const retries = parseInt(argv.retries, 10) || 0;
if (files.length === 0) {
  console.error(chalk.bold.red('No test files found'));
  process.exit(1);
}
console.log(chalk.bold.green('Running test files:'));
console.log(files.map(f => path.relative(__dirname, f)).join('\n'));

const getReporterOptions = filename => ({
  reporterEnabled: 'mocha-junit-reporters, mochawesome',
  mochaJunitReportersReporterOptions: {
    mochaFile: 'cypress/reports/junit/test_results[hash].xml',
    toConsole: false,
  },
  mochawesomeReporterOptions: {
    reportDir: './cypress/reports',
    reportFilename: filename,
    reportTitle: filename,
    reportPageTitle: filename,
    overwrite: true,
    showPassed: false,
    showFailed: true,
    enableCode: true,
    inline: true,
    html: false,
    json: true,
  },
});

const getConfig = file => ({
  spec: file,
  browser: argv.browser,
  config: {
    videosFolder: getVideoPath(file),
    screenshotsFolder: getScreenshotPath(file),
    integrationFolder: 'cypress/integration/',
    baseUrl,
    viewportWidth: parseInt(argv.width, 10),
    viewportHeight: parseInt(argv.height, 10),
    chromeWebSecurity: false,
    video: true,
    trashAssetsBeforeRuns: false,
  },
  env: {
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: getReporterOptions(path.basename(file)),
});

fs.removeSync(path.resolve(__dirname, 'reports'));
fs.mkdirsSync(path.resolve(__dirname, 'reports', 'junit'));
fs.mkdirsSync(path.resolve(__dirname, 'reports', 'videos'));
fs.mkdirsSync(path.resolve(__dirname, 'reports', 'screenshots'));

const cypressRun = file => cypress.run(getConfig(file)).then((results) => {
  if (results.totalTests === undefined) {
    // no results were run - probably an error messages
    throw results;
  }
  const testName = path.basename(file, path.extname(file));
  let screenshots = [];
  const screenshotPath = getScreenshotPath(file);

  if (fs.pathExistsSync(screenshotPath)) {
    fs.copySync(screenshotPath, path.resolve(__dirname, 'reports', 'screenshots'));
    screenshots = glob
      .sync(`${screenshotPath}/**/*.png`, {
        cwd: screenshotPath,
      })
      .map(s => s.replace(screenshotPath, 'screenshots'));
    fs.removeSync(screenshotPath);
  }

  const video = glob.sync(`${getVideoPath(file)}/**/*.mp4`)[0];

  if (video) {
    fs.copySync(video, path.resolve(__dirname, 'reports', 'videos', `${testName}.mp4`));
    fs.removeSync(getVideoPath(file));
  }

  const json = addContext(
    JSON.parse(fs.readFileSync(path.resolve(__dirname, 'reports', `${testName}.json`))),
    screenshots,
    video ? `${assetPath}videos/${testName}.mp4` : undefined,
  );
  if (json.results[0]) {
    json.results[0].file = path.relative(`${__dirname}/integration`, file);
    json.results[0].fullFile = file;
  }
  if (json.stats.failures || json.stats.tests === 0 || json.stats.other) {
    throw json;
  }
  return json;
});

const runSpec = file => defer(() => cypressRun(file))
  .pipe(retry(retries))
  .pipe(
    catchError((error) => {
      if (error.stats && (error.stats.failures || error.stats.other)) {
        return of(error);
      }
      return throwError(error);
    }),
  );

const combineReports = (reports) => {
  const options = Object.assign(getReporterOptions('UI Test Results').mochawesomeReporterOptions, {
    saveJson: true,
    reportFilename: 'index',
  });
  const mergedReports = mergeReports(reports);
  marge.create(mergedReports, options);

  if (mergedReports.stats.failures || mergedReports.stats.other) {
    process.exitCode = 1;
    console.log(chalk.bold.red('Exit Code:'), process.exitCode);
  }
};

of(...files)
  .pipe(flatMap(runSpec, null, concurrency))
  .pipe(map(r => addCucumber(r))) // only process good results
  .pipe(toArray())
  .subscribe({
    next: combineReports,
    error: (err) => {
      console.error(chalk.bold.red('Processing Error:'), err);
      process.exitCode = 1;
    },
  });
