#!/usr/bin/env node
import { Command } from 'commander';
import {
  CreateTransferInput,
  StandingOrderReoccurrenceType,
} from 'kontist/dist/lib/graphql/schema';
import * as readlineSync from 'readline-sync';

import config from './lib/config';
import options from './lib/options';
import args from './lib/arguments';
import { createAccountClient } from './lib/client';
import { OutputFormat, print, printF } from './lib/output';
import { BIN_NAME } from './lib/constants';
import { formatCurrency } from './lib/format';

const program = new Command();

program.command('list', 'list transfers', {
  executableFile: 'cli-transfer-list',
});

program
  .addArgument(args.amount)
  .addArgument(args.iban)
  .addArgument(args.recipient)
  .addArgument(args.purpose)
  .addArgument(args.e2eId)
  .addOption(options.account)
  .addOption(options.at)
  .addOption(options.dryRun)
  .option(
    '--last <date-time>',
    'The date at which the last payment will be executed for Standing Orders',
  )
  .addOption(options.note)
  .addOption(options.reoccurence)
  .addOption(options.yes)
  // TODO add category
  .addHelpText(
    'after',
    `
Examples:
  Transfer 30 EUR to Hulk Hogan
    ${BIN_NAME} transfer 3000 GB33BUKB20201555555555 "Hulk Hogan" "Wrestling Outfit"

  Create a timed order
    ${BIN_NAME} transfer 9200 GB33BUKB20201555555555 "Undertaker" "Training" --at 2022-04-15

  Create a monthly re-occuring transaction ending end of 2022
    ${BIN_NAME} transfer 3000 GB33BUKB20201555555555 "Hulk Hogan" "Wrestling Club Membership fee" \\
      --note "created after entering the wrestling club" \\
      --repeat MONTHLY \\
      --last 2022-12-31

  Create a transfer bypassing the confirmation
    ${BIN_NAME} transfer --yes 9200 GB33BUKB20201555555555 "Mr. Clever" "Math Tutoring"
  `,
  )
  .action(run)
  .parseAsync();

async function run(
  amount: number,
  iban: string,
  recipient: string,
  purpose?: string,
  e2eId?: string,
) {
  const options = program.opts<{
    account: string;
    at: string;
    dryRun: boolean;
    last: string;
    note: string;
    repeat: StandingOrderReoccurrenceType;
    yes: boolean;
  }>();

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
    // TODO display the amount formatted so that everybody can be sure
    print(parameters);
    process.exit(0);
  }

  // TODO double confirm high amount(s)?

  if (!options.yes) {
    // bold
    const amount = formatCurrency(
      parameters.amount,
      config.get('locale') as string,
      config.get('currency'),
    );
    print(
      `Please confirm that you want to transfer ${amount} the following transfer:\n`,
    );
    print(parameters);
    // TODO research common option display, uppercase for default, but which order
    // TODO add option to disable confirmation
    const confirmation = readlineSync.question('\nDo you confirm N/y ');
    if (!['y', 'Y'].includes(confirmation)) {
      print('no confirmation given, stopping here, no transaction was made\n');
      process.exit(0);
    }
  }

  const client = await createAccountClient(options.account, config);

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
