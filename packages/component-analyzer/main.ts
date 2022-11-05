import chalk from 'chalk';
import { getPropertyBreakdown } from './src/elementProcessing';
import { search } from './src/fileProcessing';
import { formatNumberAsPercentage } from './src/utils';

function main() {
  const path = process.argv[2];
  const query = process.argv[3];

  if (path === undefined) {
    throw new Error('path required');
  }

  if (query === undefined) {
    throw new Error('input required');
  }

  const { instances, fileCount } = search(path, query);

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

  console.log(chalk.hex('#4EC9B0')(`<${query}`));

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
            formatNumberAsPercentage(count, instances.length)
          )}`
        )
      );
    });
  console.log(chalk.hex('#4EC9B0')(`/>`));
}

main();
