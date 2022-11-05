import { isMatch, getBlock, getProperties, trimComponentStart } from './core';

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

  test('isMatch()', () => {
    const testInputs: Array<[string, boolean]> = [
      ['<divbert className="flex tricky="attribute" space-x-8" doggy >', false],
      ['<div>', true],
      ['<div/>', true],
      ['<div className="flex tricky="attribute" space-x-8" doggy >>', true],
      ['<div\nclassName="flex tricky="attribute" space-x-8" doggy >', true],
      ['<div\tclassName="flex tricky="attribute" space-x-8" doggy >', true],
    ];

    testInputs.forEach(([input, result]) => {
      expect(isMatch(input, 0, 'div')).toStrictEqual(result);
    });
  });

  test('getBlock()', () => {
    const testInputs: Array<[string, string]> = [
      ['<div> asdfasd', `<div>`],
      ['<div/>', '<div/>'],
      [
        '<div className="flex tricky="attribute" space-x-8" doggy >',
        '<div className="flex tricky="attribute" space-x-8" doggy >',
      ],
      [
        '<div\nclassName="flex disabled={fish < 0} tricky="attribute" space-x-8" doggy > and a Doggy too',
        '<div\nclassName="flex disabled={fish < 0} tricky="attribute" space-x-8" doggy >',
      ],
    ];

    testInputs.forEach(([input, result]) => {
      expect(getBlock(input, 0)).toStrictEqual(result);
    });
  });
});
