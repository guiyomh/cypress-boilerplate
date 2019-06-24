const mergeReports = require('./mergeReports');
const report1 = require('./mock/Counter.json');
const report2 = require('./mock/Google.json');

describe('testing mergeReports', () => {
  test('merge 2 reports', () => {
    const merged = mergeReports([report1, report2]);
    expect(merged.stats.suites).toBe(2);
    expect(merged.stats.tests).toBe(4);
    expect(merged.stats.passes).toBe(3);
    expect(merged.stats.pending).toBe(0);
    expect(merged.stats.failures).toBe(1);
    expect(merged.stats.start).toBe('2019-06-24T09:52:19.671Z');
    expect(merged.stats.end).toBe('2019-06-24T09:53:09.497Z');
    expect(merged.stats.duration).toBe(50012);
    expect(merged.stats.testsRegistered).toBe(4);
    expect(merged.stats.other).toBe(0);
    expect(merged.stats.hasOther).toBe(false);
    expect(merged.stats.skipped).toBe(0);
    expect(merged.stats.hasSkipped).toBe(false);

    expect(merged.stats.passPercent).toBe(75);
    expect(merged.stats.pendingPercent).toBe(0);

    expect(merged.results.length).toBe(2);
  });
});
