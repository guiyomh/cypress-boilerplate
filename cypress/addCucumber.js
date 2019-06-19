const fs = require('fs-extra');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Parser } = require('gherkin');

const parseFile = file => new Parser().parse(fs.readFileSync(file).toString());

const findScenario = (gherkin, name) => {
  if (!gherkin.feature || !gherkin.feature.children) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return gherkin.feature.children.find(
    scenario => scenario.type === 'Scenario' && scenario.name === name,
  );
};

const formatSteps = (steps) => {
  let scenario = '';
  steps.forEach((step) => {
    scenario += `${step.keyword} ${step.text}\n`;
  });
  return scenario;
};

const addCucumber = (r) => {
  const report = r;
  if (report.results) {
    report.results.forEach((result) => {
      if (!result.fullFile || result.fullFile.indexOf('.feature') === -1) {
        return;
      }
      const gherkinAst = parseFile(result.fullFile);

      result.suites.forEach((suite) => {
        suite.tests.forEach((test) => {
          const scenario = findScenario(gherkinAst, test.title);
          test.code = formatSteps(scenario.steps);
        });
      });
    });
  }
  return report;
};
module.exports = addCucumber;
