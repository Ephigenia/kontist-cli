import { Option } from 'commander';
import { parseDateAndTime } from './option-parser';

export default {
  dryRun: new Option('--dry-run', 'don’t do anything, print infos only'),
  executeAt: new Option(
    '--executeAt <date-time>',
    'The date at which the payment will be executed for Timed Orders or Standing Orders in the format "YYYY-MM-DD"',
  ).argParser(parseDateAndTime),
  limit: new Option('--limit <limit>', 'number of items to show')
    .default(50)
    .argParser((value: string) => +value),
  password: new Option(
    '-p, --password <password>',
    'acccount password, better: consider tty in password, see examples',
  ),
  personalNote: new Option(
    '-n, --note <personalNote>',
    'personal note next to the purpose',
  ),
  plain: new Option('--plain', 'print out in plain text format'),
  secret: new Option(
    '-s, --secret <clientSecret>',
    'optional oauth client secret to be used',
  ),
  transferStatus: new Option('--status <status>', 'filter transfers by status'),
};
