const fs = require('fs-extra');
const { Parser } = require('gherkin');

const parseFile = file => new Parser().parse(fs.readFileSync(file).toString());

const processExamples = (examples) => {
  const rows = [];
  examples.forEach((example) => {
    const headers = example.tableHeader.cells.map(cell => cell.value);
    example.tableBody.forEach((tableBody) => {
      const row = {};
      tableBody.cells.forEach((cell, i) => {
        row[headers[i]] = cell.value;
      });
      rows.push(row);
    });
  });
  return rows;
};

/**
 * Replace <placeholder> in the source by the correct property value of the row
 * @param {string} text source with placeholder
 * @param {object} row A keys-values object
 * @example
 * replaceExample('I search <term> in <engine>',{term: 'cypress.io', engine: 'google'})
 * // I search "cypress.io" in "google"
 */
const replaceExample = (text, row) => text.replace(/(<([0-9a-z_-]+)>)/gi, (x) => {
  const field = x.replace(/<|>/g, '');
  return row[field];
});

const createScenario = (outline, example, index) => Object.assign(
  Object.assign({}, outline),
  {
    type: 'Scenario',
    keyword: 'Scenario',
    name: `${replaceExample(outline.name, example)} (example #${index})`,
    steps: outline.steps.map(step => Object.assign(
      Object.assign({}, step),
      { text: replaceExample(step.text, example) },
    )),
  },
);

const processScenarioOutline = (gherkin) => {
  if (!gherkin.feature || !gherkin.feature.children) {
    return;
  }
  const processedScenario = [];
  gherkin.feature.children
    .filter(scenario => scenario.type === 'ScenarioOutline')
    .forEach((scenario) => {
      const examples = processExamples(scenario.examples);
      examples.forEach((example, index) => {
        processedScenario.push(createScenario(scenario, example, index + 1));
      });
    });
  gherkin.feature.children = gherkin.feature.children.concat(processedScenario);
  return gherkin;
};

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
    scenario += `${step.keyword.trim()} ${step.text.trim()}\n`;
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
      const gherkinAst = processScenarioOutline(parseFile(result.fullFile));

      result.suites.forEach((suite) => {
        suite.tests.forEach((test) => {
          const scenario = findScenario(gherkinAst, test.title);
          if (!scenario) { return; }
          // eslint-disable-next-line no-param-reassign
          test.code = formatSteps(scenario.steps);
        });
      });
    });
  }
  return report;
};
module.exports = addCucumber;
