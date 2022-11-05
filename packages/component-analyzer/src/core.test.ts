import { getProperties, trimComponentStart } from './core';

describe('component-analyzer:', () => {
  test('trimComponentStart()', () => {
    const testInputs: Array<[string, string]> = [
      [
        '<div className={styles.container} bar="fish" foo dog>',
        'className={styles.container} bar="fish" foo dog>',
      ],
      ['<div>', ''],
      ['<div/>', '>'],
      [
        '<div\nclasses={<Test foobar="dog" />} fish/>',
        'classes={<Test foobar="dog" />} fish/>',
      ],
    ];

    testInputs.forEach(([input, result]) => {
      expect(trimComponentStart(input)).toBe(result);
    });
  });

  test('getProperties()', () => {
    const testInputs: Array<[string, string[]]> = [
      [
        '<div className={styles.container} bar="fish" foo dog>',
        ['className', 'bar', 'foo', 'dog'],
      ],
      ['<div>', []],
      [
        '<div className="flex tricky="attribute" space-x-8" doggy >',
        ['className', 'doggy'],
      ],
      ['<div classes={<Test foobar="dog" />} fish/>', ['classes', 'fish']],
    ];

    testInputs.forEach(([input, result]) => {
      expect(getProperties(input)).toStrictEqual(result);
    });
  });
});
