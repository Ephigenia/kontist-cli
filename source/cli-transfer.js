#!/usr/bin/env node
import { Command } from 'commander';
import readlineSync from 'readline-sync';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';

const program = new Command();
program
  .arguments('[iban] [recipient] [amount] [purpose]', {
    iban: 'TODO',
    recipient: 'TODO',
    amount: 'TODO',
    purpose: 'TODO',
  })
  .action(run)
  // TODO add search https://kontist.dev/sdk/#transactions-search
  .parseAsync();

async function run(iban, recipient, amount, purpose) {
  // TODO validate amount
  // TODO validate recipient

  // TODO add double-confirmation for all budgets above a specific limit (20?)

  const parameters = {
    amount,
    // TODO e2eId (optional)
    iban,
    purpose,
    recipient,
  };

  console.log('Please confirm that you want to make the following transfer');
  console.log(parameters);

  // TODO research common option display, uppercase for default, but which order
  const confirmation = readlineSync.question('Do you confirm N/y ');
  if (!['y', 'Y'].includes(confirmation)) {
    console.log('no confirmation given, stopping here, no transaction was made');
    process.exit(0);
  }

  const client = await createDefaultClient(config.get());
  const confirmationId = await client.models.transfer.createOne(parameters);

  console.log('requests confirmation code, please enter the OTP when prompted');
  const otpToken = readlineSync.question('Enter OTP ');
  // TODO find out which way to verify that the code looks good, in case
  //      to ask again
  console.log('received confirmation code ... verifying transfer');

  // wait for sms
  const result = await client.models.transfer.confirmOne(
    confirmationId,
    otpToken
  );
  // example in transaction.result.tmp.json
  console.log(result);

  // TODO possible exception happened when amount was 0
  //      GraphQLError: Error when creating wire transfer
  // at GraphQLError.KontistSDKError [as constructor] (/Users/ephigenia/Development/kontist/node_modules/kontist/dist/lib/errors.js:46:28)
};
