import { getBlock, isMatch } from './fileProcessing';

describe('component-analyzer:', () => {
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
