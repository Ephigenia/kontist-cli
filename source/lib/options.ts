import { Option } from 'commander';
import { StandingOrderReoccurrenceType } from 'kontist/dist/lib/graphql/schema';
import { parseDateAndTime, parseIban } from './option-parser';

export default {
  account: new Option(
    '-a, --account <alias>',
    'Defines which account alias should be used',
  ).default('default'),
  at: new Option(
    '--at <date-time>',
    'The date at which the payment will be executed for Timed Orders or Standing Orders in the format "YYYY-MM-DD"',
  ).argParser(parseDateAndTime),
  dryRun: new Option('--dry-run', 'don’t do anything, print infos only'),
  from: new Option(
    '--from <date-time>',
    'include items beginning from that date',
  ).argParser(parseDateAndTime),
  iban: new Option(
    '--iban <iban...>',
    'International Bank Account Number (IBAN)',
  ).argParser((cur: string, arr: string[] = []) => {
    return [parseIban(cur), ...arr];
  }),
  limit: new Option('--limit <limit>', 'number of items to show')
    .default(50)
    .argParser((value: string) => +value),
  note: new Option('-n, --note <note>', 'personal note next to the purpose'),
  password: new Option(
    '-p, --password <password>',
    'acccount password, better: consider tty in password, see examples',
  ),
  reoccurence: new Option(
    '--repeat <interval>',
    'The reoccurrence type of the payments for Standing Orders',
  ).choices([
    StandingOrderReoccurrenceType.Annually,
    StandingOrderReoccurrenceType.EverySixMonths,
    StandingOrderReoccurrenceType.Monthly,
    StandingOrderReoccurrenceType.Quarterly,
  ]),
  plain: new Option('--plain', 'print out in plain text format'),
  secret: new Option(
    '-s, --secret <clientSecret>',
    'optional oauth client secret to be used',
  ),
  to: new Option(
    '--to <date-time>',
    'include items ending at that date',
  ).argParser(parseDateAndTime),
  transferStatus: new Option('--status <status>', 'filter transfers by status'),
  yes: new Option('-y, --yes', 'bypass confirmation/auto confirmation'),
};
