#!/usr/bin/env node
import { Command } from 'commander';
import { CreateTransferInput } from 'kontist/dist/lib/graphql/schema';
import * as readlineSync from 'readline-sync';

import { createDefaultClient } from './lib/client';
import config from './lib/config';
import { OutputFormat, print, printF } from './lib/output';
import options from './lib/options';
import args from './lib/arguments';

const program = new Command();
program
  .addArgument(args.iban)
  .argument('<recipient>', 'recipient name')
  .argument('<amount>', 'amount in cents (f.e. 2134 are 21.34)')
  .argument('<purpose>', 'recipient IBAN')
  .argument('<e2eId>', 'end to end id, reference')
  .addOption(options.executeAt)
  .addOption(options.dryRun)
  .action(run)
  .parseAsync();

async function run(
  iban: string,
  recipient: string,
  amount: string,
  purpose: string,
  endToEndId: string,
) {
  const options = program.opts();
  // TODO validate amount
  // TODO validate recipient

  // TODO add double-confirmation for all budgets above a specific limit (20?)

  const parameters: CreateTransferInput = {
    amount: parseFloat(amount),
    e2eId: endToEndId,
    iban,
    purpose,
    recipient,
    ...(options.executeAt && { executeAt: options.executeAt }),
  };

  if (options.dryRun) {
    print(parameters);
    process.exit(0);
  }

  print('Please confirm that you want to make the following transfer\n');
  // TODO research common option display, uppercase for default, but which order
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
