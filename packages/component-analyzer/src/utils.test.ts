import { formatNumberAsPercentage } from './utils';

describe('utils:', () => {
  test('formatNumberAsPercentage(10, 10) to be 100.00%', () => {
    expect(formatNumberAsPercentage(10, 10)).toBe('100.00%');
  });

  test('formatNumberAsPercentage(5, 10) to be 50.00%', () => {
    expect(formatNumberAsPercentage(5, 10)).toBe('50.00%');
  });

  test('formatNumberAsPercentage(2, 3) to be 66.66%', () => {
    expect(formatNumberAsPercentage(2, 3)).toBe('66.67%');
  });

  test('formatNumberAsPercentage(15, 10) to be 100.00%', () => {
    expect(formatNumberAsPercentage(15, 10)).toBe('150.00%');
  });

  test('formatNumberAsPercentage(15, 0) to be NaN', () => {
    expect(formatNumberAsPercentage(10, 0)).toBe(NaN);
  });
});
