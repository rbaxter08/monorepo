import { getElement, isMatch } from './fileProcessing';

describe('fileProcessing:', () => {
  describe('isMatch()', () => {
    test('Should check for newline terminator', () => {
      expect(isMatch('<div\nclassName=', 0, 'div')).toBe(true);
      expect(isMatch('<divbert\nclassName=', 0, 'div')).toBe(false);
    });

    test('Should check for > terminator', () => {
      expect(isMatch('<div>', 0, 'div')).toBe(true);
      expect(isMatch('<divbert>', 0, 'div')).toBe(false);
    });

    test('Should check for tab terminator', () => {
      expect(isMatch('<div\tclassName=', 0, 'div')).toBe(true);
      expect(isMatch('<divbert\tclassName=', 0, 'div')).toBe(false);
    });

    test('Should check for / terminator', () => {
      expect(isMatch('<div/>', 0, 'div')).toBe(true);
      expect(isMatch('<divbert>', 0, 'div')).toBe(false);
    });

    test('Should check for space terminator', () => {
      expect(isMatch('<div className=', 0, 'div')).toBe(true);
      expect(isMatch('<divbert className=', 0, 'div')).toBe(false);
    });
  });

  describe('getElement():', () => {
    test('basic tests: should match emptyelements', () => {
      expect(getElement('<div/> and a bunch of junk', 0)).toBe('<div/>');
      expect(getElement('<div /> and a bunch of junk', 0)).toBe('<div />');
      expect(getElement('<div\n/> and a bunch of junk', 0)).toBe('<div\n/>');
      expect(getElement('<div> and a bunch of junk', 0)).toBe('<div>');
      expect(getElement('<div > and a bunch of junk', 0)).toBe('<div >');
    });

    test('advanced tests: should capture element content', () => {
      expect(getElement('<div and a bunch of junk />', 0)).toBe(
        '<div and a bunch of junk />'
      );
      expect(getElement('<div weird={<div>hmm</div>} >', 0)).toBe(
        '<div weird={<div>hmm</div>} >'
      );
      expect(
        getElement('<div weird={test < 0} /> and a bunch of junk', 0)
      ).toBe('<div weird={test < 0} />');
    });
  });
});
