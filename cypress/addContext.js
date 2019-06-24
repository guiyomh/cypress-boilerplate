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

const escapeRegExp = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const addContext = (report, screenshots, videoUrl) => {
  const getTests = t => t.tests || [];
  const getSuites = t => t.suites || [];

  const addSuiteContext = (suite, previousTitles = []) => {
    const titles = suite.title ? previousTitles.concat(suite.title) : previousTitles;
    getTests(suite).forEach((test) => {
      const context = [];
      if (videoUrl) {
        context.splice(0, 0, {
          title: 'Video',
          value: videoUrl,
        });
      }

      const testFileName = titles
        .concat(test.title)
        .join(' -- ')
        .replace(/,/g, '');
      const testScreenshots = screenshots.filter(s => s.includes(testFileName));
      testScreenshots.forEach((screenshot) => {
        // There could be multiple screenshots for various reasons.
        // `${testFileName}.png` is the failure one. Others are postfixed with a name
        if (screenshot.includes(`${testFileName}.png`)) {
          context.splice(0, 0, {
            title: 'Failure Screenshot',
            value: screenshot,
          });
        } else {
          context.splice(0, 0, {
            title: screenshot.match(`${escapeRegExp(testFileName)}(.+).png`)[1].replace(' -- ', '').trim(),
            value: screenshot,
          });
        }
      });
      // eslint-disable-next-line no-param-reassign
      test.context = JSON.stringify(context);
    });

    getSuites(suite).forEach((s) => {
      addSuiteContext(s, titles);
    });
  };

  report.results.forEach((result) => {
    getSuites(result).forEach(suite => addSuiteContext(suite));
  });

  return report;
};

module.exports = addContext;
