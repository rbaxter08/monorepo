import chalk from 'chalk';
import fs from 'fs';
import klawSync from 'klaw-sync';

// determines if, starting from the current character, we are about to hit a match
// by looking ahead and checking the chars
export function isMatch(data: string, startIndex: number, target: string) {
  const subStr = data.substring(startIndex, startIndex + target.length + 2);

  const matches =
    subStr === `<${target} ` ||
    subStr === `<${target}>` ||
    subStr === `<${target}/` ||
    subStr === `<${target}\n` ||
    subStr === `<${target}\t`;

  return matches;
}

export function createTopLevelTracker() {
  const brackets: string[] = [];
  const quotes: string[] = [];

  function handleCharacter(ch?: string) {
    if (ch === '{') {
      brackets.push(ch);
      return true;
    }

    if (ch === '}') {
      brackets.pop();
      return true;
    }
    if (ch === '"') {
      if (quotes.length === 0) {
        quotes.push(ch);
      } else {
        quotes.pop();
      }
      return true;
    }

    return false;
  }

  function isTopLevel() {
    return brackets.length === 0 && quotes.length === 0;
  }

  return { isTopLevel, handleCharacter };
}

// once we know we are hitting a match, get the full block of the element
// by finding it's closing > index
export function getBlock(data: string, startIndex: number) {
  const brackets = ['<'];
  let result = '<';
  let currentIndex = startIndex + 1;

  const { isTopLevel, handleCharacter } = createTopLevelTracker();

  while (brackets.length && data[currentIndex] !== undefined) {
    const currentCharacter = data[currentIndex];
    handleCharacter(currentCharacter);

    if (isTopLevel()) {
      if (currentCharacter === '<') {
        brackets.push(currentCharacter);
      }

      if (currentCharacter === '>') {
        brackets.pop();
      }
    }

    result += currentCharacter;
    currentIndex++;
  }

  if (brackets.length) {
    throw new Error('Invalid File Exception');
  }

  return result;
}

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
  const allProps = instances.flatMap((instance) => getProperties(instance));
  return allProps;
}

function getPercentage(count: number, total: number) {
  return (count / total) * 100;
}

function processFile(path: string, input: string) {
  // read in the file
  const data = fs.readFileSync(path, 'utf-8');
  // console.log('processing', path);
  // loop through and look for a comopnent
  const instances: string[] = [];
  data.split('').forEach((_, index) => {
    if (isMatch(data, index, input)) {
      instances.push(getBlock(data, index));
    }
  });
  return instances;
}

export function main() {
  const path = process.argv[2];
  const input = process.argv[3];

  if (path === undefined) {
    throw new Error('path required');
  }

  if (input === undefined) {
    throw new Error('input required');
  }

  const checkedFilesDict: Record<string, boolean> = {};

  const files: klawSync.Item[] = [];
  const dirs: klawSync.Item[] = [];

  if (fs.lstatSync(path).isDirectory()) {
    files.push(...klawSync(path, { nodir: true }));
    dirs.push(...klawSync(path, { nofile: true }));
  } else {
    files.push({ path } as klawSync.Item);
  }

  // collect all files
  while (dirs.length) {
    const currentDir = dirs.pop();
    if (currentDir) {
      files.push(...klawSync(currentDir.path, { nodir: true }));
      dirs.push(...klawSync(currentDir.path, { nofile: true }));
    }
  }

  function checkFiles(input: string) {
    const allInstances: string[] = [];

    let fileCount = 0;
    // process all files
    files.forEach((file) => {
      if (checkedFilesDict[file.path] === true) return;
      checkedFilesDict[file.path] = true;
      const fileInstances = processFile(file.path, input);
      allInstances.push(...fileInstances);
      if (fileInstances.length > 0) {
        fileCount++;
      }
    });

    return { fileCount, allInstances };
  }

  const { fileCount, allInstances } = checkFiles(input);

  // If no instances, break early
  if (allInstances.length === 0) {
    console.log(`No instances of ${input}`);
    return;
  }

  // If instances, start aggregating for output
  const propDict: Record<string, number> = {};
  getPropertyBreakdown(allInstances).forEach((property) => {
    if (propDict[property] === undefined) propDict[property] = 0;
    propDict[property] += 1;
  });

  console.log(`Searched ${files.length} files\n`);

  console.log(
    `Found ${chalk.hex('#4EC9B0')(
      allInstances.length
    )} instances of ${chalk.hex('#4EC9B0')(`<${input} />`)} in ${chalk.hex(
      '#4EC9B0'
    )(`${fileCount}`)} files\n`
  );

  console.log(chalk.hex('#4EC9B0')(`<${input}`));

  Object.keys(propDict)
    .sort((a, b) => {
      // @ts-ignore
      return propDict[b] - propDict[a];
    })
    .forEach((property) => {
      const count = propDict[property] ?? 0;
      console.log(
        chalk.hex('#9CDCFE')(
          `  ${property}${chalk.white(
            `: ${getPercentage(count, allInstances.length).toFixed(4)}%`
          )}`
        )
      );
    });
  console.log(chalk.hex('#4EC9B0')(`/>`));
}
