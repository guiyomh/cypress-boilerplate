
const addContext = require('./addContext');

describe('testing addContext', () => {
  const checks = [
    {
      name: 'test a feature file',
      args: {
        report: {
          results: [{
            suites: [{
              title: 'Suite 1',
              tests: [
                { title: 'test1' },
                { title: 'test2' },
              ],
            }],
          }],
        },
        screenshots: [
          '/tmp/screenshots/Suite 1 -- test1 screen2.png',
          '/tmp/screenshots/Suite 1 -- test1 screen1.png',
          '/tmp/screenshots/Suite 1 -- test2 screen1.png',
          '/tmp/screenshots/Suite 1 -- test2 screen2.png',
        ],
        videoUrl: null,
      },
      expected: {
        results: [{
          suites: [{
            title: 'Suite 1',
            tests: [
              {
                title: 'test1',
                context: JSON.stringify([
                  {
                    title: 'screen1',
                    value: '/tmp/screenshots/Suite 1 -- test1 screen1.png',
                  },
                  {
                    title: 'screen2',
                    value: '/tmp/screenshots/Suite 1 -- test1 screen2.png',
                  },
                ]),
              },
              {
                title: 'test2',
                context: JSON.stringify([
                  {
                    title: 'screen2',
                    value: '/tmp/screenshots/Suite 1 -- test2 screen2.png',
                  },
                  {
                    title: 'screen1',
                    value: '/tmp/screenshots/Suite 1 -- test2 screen1.png',
                  },
                ]),
              },
            ],
          }],
        }],
      },
    },

  ];
  checks.forEach((check) => {
    test(check.name, () => {
      expect(
        addContext(
          check.args.report,
          check.args.screenshots,
          check.args.videoUrl,
        ),
      ).toEqual(check.expected);
    });
  });
});
