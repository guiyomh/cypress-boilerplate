const fs = require('fs-extra');
const addCucumber = require('./addCucumber');

jest.mock('fs-extra', () => ({
  readFileSync: jest.fn(),
}));

describe('testing addCucumber', () => {
  const checks = [
    {
      name: 'test a feature file',
      args: {
        report: {
          results: [{
            fullFile: '/tmp/foo.feature',
            suites: [{
              tests: [
                { title: 'test1', code: 'alert("bar");' },
                { title: 'test2', code: 'alert("foo");' },
              ],
            }],
          }],
        },
      },
      expected: {
        results: [{
          fullFile: '/tmp/foo.feature',
          suites: [{
            tests: [
              { title: 'test1', code: 'Given something\nThen amazing\n' },
              { title: 'test2', code: 'Given foo\nThen bar\n' },
            ],
          }],
        }],
      },
    },
    {
      name: 'test a non feature file',
      args: {
        report: {
          results: [{
            fullFile: '/tmp/foo.spec.js',
            suites: [{
              tests: [
                { title: 'test1', code: 'alert("bar");' },
                { title: 'test2', code: 'alert("foo");' },
              ],
            }],
          }],
        },
      },
      expected: {
        results: [{
          fullFile: '/tmp/foo.spec.js',
          suites: [{
            tests: [
              { title: 'test1', code: 'alert("bar");' },
              { title: 'test2', code: 'alert("foo");' },
            ],
          }],
        }],
      },
    },
  ];
  checks.forEach((check) => {
    test(check.name, () => {
      fs.readFileSync.mockReturnValue(`Feature: Mock feature file

    I want to open a search engine page

    @focus
    Scenario: test1
        Given something
        Then amazing

    Scenario: test2
        Given foo
        Then bar
`);
      expect(addCucumber(check.args.report)).toEqual(check.expected);
    });
  });
});
