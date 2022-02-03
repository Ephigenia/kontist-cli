import { Option } from 'commander';

export const options = {
  dryRun: new Option('--dry-run', 'don’t do anything, print infos only'),
  transferStatus: new Option(
    '--status <status>',
    'filter transfers by status'
  ),
  limit: new Option(
    '--limit <limit>',
    'number of items to show'
  ).default(50).argParser((value:string) => +value),
}

