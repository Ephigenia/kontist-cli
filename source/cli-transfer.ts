#!/usr/bin/env node
import { Command } from 'commander';
import { CreateTransferInput } from 'kontist/dist/lib/graphql/schema';
import readlineSync from 'readline-sync';

import { createDefaultClient } from './lib/client';
import config from './lib/config';

const program = new Command();
program
  .argument('<iban>', 'IBAN')
  .argument('<recipient>', 'recipient name')
  .argument('<amount>', 'amount in cents (f.e. 2134 are 21.34)')
  .argument('<purpose>', 'recipient IBAN')
  .argument('<e2eId>', 'end to end id, reference')
  .option('--dry-run', 'don’t do anything, print infos only')
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
  };

  console.log('Please confirm that you want to make the following transfer');
  console.log(parameters);

  if (options.dryRun) {
    process.exit(0);
  }

  // TODO research common option display, uppercase for default, but which order
  const confirmation = readlineSync.question('Do you confirm N/y ');
  if (!['y', 'Y'].includes(confirmation)) {
    console.log(
      'no confirmation given, stopping here, no transaction was made',
    );
    process.exit(0);
  }

  const client = await createDefaultClient(config);
  const confirmationId = await client.models.transfer.createOne(parameters);

  console.log('requests confirmation code, please enter the OTP when prompted');
  const otpToken = readlineSync.question('Enter OTP ');
  // TODO find out which way to verify that the code looks good, in case
  //      to ask again
  console.log('received confirmation code ... verifying transfer');

  // wait for sms
  const result = await client.models.transfer.confirmOne(
    confirmationId,
    otpToken,
  );
  // example in transaction.result.tmp.json
  console.log(result);

  // TODO possible exception happened when amount was 0
  //      GraphQLError: Error when creating wire transfer
  // at GraphQLError.KontistSDKError [as constructor] (/Users/ephigenia/Development/kontist/node_modules/kontist/dist/lib/errors.js:46:28)
}
