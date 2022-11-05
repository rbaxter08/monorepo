import fs from 'fs';
import klawSync from 'klaw-sync';

const terminatingCharRegex = /\s|>|\//;
export function isMatch(data: string, index: number, query: string) {
  // +2 1 to make last char inclusive, 1 to account for terminating char
  const subStr = data.substring(index, index + query.length + 2);
  return terminatingCharRegex.test(subStr);
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
export function getElement(data: string, startIndex: number) {
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

  return brackets.length ? '' : result;
}

/**
 * For every char in the file, see if that char is the start of a match
 * if so: get the element
 * if not: return empty str
 * then filter out the empty str
 *
 * returns: string[] - an array of all the matched elments
 */
function processFile(path: string, query: string) {
  const data = fs.readFileSync(path, 'utf-8');

  const d = data.split('').flatMap((_, index) => {
    if (isMatch(data, index, query)) {
      const element = getElement(data, index);
      return element === '' ? [] : [element];
    }

    return [];
  });
  return d.filter((match) => match !== '');
}

function checkFiles(paths: string[], input: string) {
  const checkedFilesDict: Record<string, boolean> = {};
  let fileCount = 0;
  const instances = paths.flatMap((path) => {
    if (checkedFilesDict[path] === true) {
      return [];
    }

    checkedFilesDict[path] = true;
    const fileInstances = processFile(path, input);
    if (fileInstances.length > 0) {
      fileCount++;
    }

    return fileInstances;
  });

  return { fileCount, instances };
}

function getFilePaths(path: string) {
  const dirs: klawSync.Item[] = [];
  const files: string[] = [];

  if (fs.lstatSync(path).isDirectory()) {
    files.push(...klawSync(path, { nodir: true }).map((file) => file.path));
    dirs.push(...klawSync(path, { nofile: true }));
  } else {
    files.push(path);
  }

  // collect all files
  while (dirs.length) {
    const currentDir = dirs.pop();
    if (currentDir) {
      dirs.push(...klawSync(currentDir.path, { nofile: true }));
      files.push(
        ...klawSync(currentDir.path, { nodir: true }).map((file) => file.path)
      );
    }
  }

  return files;
}

export function search(path: string, query: string) {
  const paths = getFilePaths(path);
  const { fileCount, instances } = checkFiles(paths, query);
  return { fileCount, instances };
}
