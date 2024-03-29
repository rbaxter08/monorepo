import chalk from 'chalk';
import { getPropertyBreakdown } from './elementProcessing';
import type { SearchResult } from './fileProcessing';
import { formatNumberAsPercentage } from './utils';

export function logResults(
  { instances, fileCount, imports }: SearchResult,
  query: string
) {
  // If no instances, break early
  if (instances.length === 0) {
    console.log(`No instances of ${query}`);
    return;
  }

  // If instances, start aggregating for output
  const propDict: Record<string, number> = {};
  getPropertyBreakdown(instances).forEach((property) => {
    if (propDict[property] === undefined) propDict[property] = 0;
    propDict[property] += 1;
  });

  console.log(
    `Found ${chalk.hex('#4EC9B0')(instances.length)} instances of ${chalk.hex(
      '#4EC9B0'
    )(`<${query} />`)} in ${chalk.hex('#4EC9B0')(`${fileCount}`)} files\n`
  );

  const importDict: Record<string, number> = {};
  imports.forEach((imp) => {
    if (importDict[imp] === undefined) importDict[imp] = 0;
    importDict[imp] += 1;
  });

  const output: Array<{ 'imported from': string; '% of imports': number }> = [];
  Object.keys(importDict)
    .sort((a, b) => {
      // @ts-ignore
      return importDict[b] - importDict[a];
    })
    .forEach((imp) => {
      output.push({
        'imported from': imp,
        '% of imports':
          Math.floor(((importDict[imp] ?? 0) / imports.length) * 100) ?? 0,
      });
    });
  console.table(output);

  console.log(chalk.hex('#4EC9B0')(`\n\n\t<${query}`));
  let longestPropertyLength = 0;
  Object.keys(propDict)
    .sort((a, b) => {
      longestPropertyLength = Math.max(b.length, longestPropertyLength);
      longestPropertyLength = Math.max(a.length, longestPropertyLength);

      // @ts-ignore
      return propDict[b] - propDict[a];
    })
    .forEach((property) => {
      const count = propDict[property] ?? 0;
      const propLabel = `\t  ${property} `.padEnd(longestPropertyLength + 5);
      console.log(
        chalk.hex('#9CDCFE')(
          `${propLabel}${chalk.white(
            formatNumberAsPercentage(count, instances.length)
          )}`
        )
      );
    });
  console.log(chalk.hex('#4EC9B0')(`\t/>\n\n`));
}
