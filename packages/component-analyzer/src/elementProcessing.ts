import { createTopLevelTracker } from './fileProcessing';

/**
 * The following terminators mark the end of property
 * =, /, >, {, ", and any white space char
 */
const propertyTerminatingRegex = /[=|/|>|\s|{|"]/;
const componentTerminatingRegex = /[>|/|\s]/;

export function trimComponentStart(input: string) {
  if (input[0] !== '<') return input;

  let currentIndex = 0;
  let currentChar = input[currentIndex];
  while (
    currentChar !== undefined &&
    !componentTerminatingRegex.test(currentChar)
  ) {
    currentChar = input[currentIndex];
    currentIndex++;
  }

  return input.substring(currentIndex);
}

export function getProperties(input: string): string[] {
  const properties: string[] = [];
  const { isTopLevel, handleCharacter } = createTopLevelTracker();

  let result = '';
  trimComponentStart(input)
    .split('')
    .forEach((ch) => {
      const isSpecialChar = handleCharacter(ch);
      if (isSpecialChar) return;

      if (isTopLevel()) {
        if (propertyTerminatingRegex.test(ch) && result) {
          properties.push(result.trim());
          result = '';
          return;
        }
        result += ch;
        return;
      }

      result = '';
    });
  return properties.filter((prop) => prop !== '');
}

export function getPropertyBreakdown(instances: string[]): Array<string> {
  return instances.flatMap((instance) => getProperties(instance));
}
