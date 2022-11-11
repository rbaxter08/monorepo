import { program } from 'commander';
import { search } from './src/fileProcessing';
import { logResults } from './src/logResults';

program
  .option('-p, --path <type>', 'directory path to search through')
  .option('-q --query <type>', 'Component to search for');

program.parse();

const path = program.opts()['path'];
const query = program.opts()['query'];
const searchResults = search(path, query);
logResults(searchResults, query);
