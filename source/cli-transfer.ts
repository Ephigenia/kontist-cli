#!/usr/bin/env node
import { Command } from 'commander';
import { CreateTransferInput } from 'kontist/dist/lib/graphql/schema';
import * as readlineSync from 'readline-sync';

import { createDefaultClient } from './lib/client';
import config from './lib/config';
import { OutputFormat, print, printF } from './lib/output';
import options from './lib/options';
import args from './lib/arguments';
import { BIN_NAME } from './lib/constants';

const program = new Command();

program.command('list', 'list transfers', {
  executableFile: 'cli-transfer-list',
});

program
  .addArgument(args.iban)
  .addArgument(args.recipient)
  .addArgument(args.amount)
  .addArgument(args.purpose)
  .addArgument(args.e2eId)
  .addOption(options.at)
  .addOption(options.dryRun)
  .option(
    '--last <date-time>',
    'The date at which the last payment will be executed for Standing Orders',
  )
  .addOption(options.note)
  .addOption(options.reoccurence)
  // TODO add category
  .addHelpText(
    'after',
    `
Examples:
  Transfer 30 EUR to Hulk Hogan
    ${BIN_NAME} transfer DE123456789102334 "Hulk Hogan" 3000 "Wrestling Outfit"

  Create a timed order
    ${BIN_NAME} transfer DE123456789102334 "Undertaker" 9200 "Training" --exececuteAt 2022-04-15

  Create a re-occuring which happens every month until end of 2022
    ${BIN_NAME} transfer DE123456789102334 "Hulk Hogan" 3000 "Wrestling Club Membership fee" \\
      --note "created after entering the wrestling club" \\
      --repeat MONTHLY \\
      --at 2022-02-14 \\
      --last 2022-12-31
  `,
  )
  .action(run)
  .parseAsync();

async function run(
  iban: string,
  recipient: string,
  amount: number,
  purpose?: string,
  e2eId?: string,
) {
  const options = program.opts();
  // TODO validate amount
  // TODO validate recipient

  // TODO add double-confirmation for all budgets above a specific limit (20?)

  const parameters: CreateTransferInput = {
    amount,
    ...(options.at && { executeAt: options.at }),
    ...(e2eId && { e2eId }),
    iban,
    ...(options.last && { last: options.last }),
    ...(options.note && { personalNote: options.note }),
    purpose,
    recipient,
    ...(options.repeat && { reoccurrence: options.repeat }),
  };

  if (options.dryRun) {
    print(parameters);
    process.exit(0);
  }

  print('Please confirm that you want to make the following transfer\n');
  // TODO research common option display, uppercase for default, but which order
  // TODO add option to disable confirmation
  const confirmation = readlineSync.question('Do you confirm N/y ');
  if (!['y', 'Y'].includes(confirmation)) {
    print('no confirmation given, stopping here, no transaction was made\n');
    process.exit(0);
  }

  const client = await createDefaultClient(config);
  const confirmationId = await client.models.transfer.createOne(parameters);

  // TODO add error handling when confirming the transfer
  print('requests confirmation code, please enter the OTP when prompted\n');
  const otpToken = readlineSync.question('Enter OTP: ');
  // TODO find out which way to verify that the code looks good, in case
  //      to ask again
  print('received confirmation code ... verifying transfer');

  // wait for sms
  const result = await client.models.transfer.confirmOne(
    confirmationId,
    otpToken,
  );
  // example in transaction.result.tmp.json
  printF(OutputFormat.JSON, result);

  // TODO possible exception happened when amount was 0
  //      GraphQLError: Error when creating wire transfer
  // at GraphQLError.KontistSDKError [as constructor] (/Users/ephigenia/Development/kontist/node_modules/kontist/dist/lib/errors.js:46:28)
}
