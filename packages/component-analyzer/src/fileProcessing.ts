import fs from 'fs';
import klawSync from 'klaw-sync';

const terminatingCharRegex = /\s|>|\//;
/**
 *
 * @param data - The full body of text that we're examining
 * @param index - The index to check for a potential match
 * @param target - The match to look for
 * @returns true if the current index is the start of a query match, false otherwise
 */
export function isMatch(data: string, index: number, query: string) {
  const subStr = data.substring(index, index + query.length + 1);
  const terminatingChar = data[index + query.length + 1] ?? '';
  return subStr === `<${query}` && terminatingCharRegex.test(terminatingChar);
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

  if (brackets.length) {
    throw new Error('Error: missing closing > for element');
  }

  return result;
}

// https://stackoverflow.com/a/73265022 lol
// this is close, but not perfect, it over selects, probably in cases like "ButtonDialog"
// or "DialogButton", etc.
const importRegex =
  /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s](.*[@\w/_-]+)["'\s].*/gm;

function getImports(data: string, query: string) {
  const imports = [...data.matchAll(importRegex)];
  return imports
    .filter((importMatch) => importMatch[1]?.includes(query) && importMatch[2])
    .map((importMatch) => importMatch[2]) as string[];
}

function processFile(path: string, query: string) {
  const data = fs.readFileSync(path, 'utf-8');
  const instances: string[] = [];
  let hasMatch = false;
  data.split('').forEach((_, index) => {
    if (isMatch(data, index, query)) {
      hasMatch = true;
      instances.push(getElement(data, index));
    }
  });

  let imports: string[] = [];
  if (hasMatch) {
    imports = getImports(data, query);
  }
  return { instances, imports };
}

function processFiles(paths: string[], input: string) {
  const checkedFilesDict: Record<string, boolean> = {};
  let fileCount = 0;
  let imps: string[] = [];
  const instances = paths.flatMap((path) => {
    if (checkedFilesDict[path] === true) {
      return [];
    }

    checkedFilesDict[path] = true;
    const { instances, imports } = processFile(path, input);
    if (instances.length > 0) {
      fileCount++;
    }
    imps.push(...imports);

    return instances;
  });

  return { fileCount, instances, imports: imps };
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

export type SearchResult = ReturnType<typeof search>;

export function search(path: string, query: string) {
  const paths = getFilePaths(path);
  return processFiles(paths, query);
}
