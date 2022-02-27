#!/usr/bin/env node
import { Command } from 'commander';
import { Transaction } from 'kontist/dist/lib/graphql/schema';

import config from './lib/config';
import options from './lib/options';
import { createAccountClient } from './lib/client.js';
import { BIN_NAME } from './lib/constants.js';
import { formatTransaction } from './lib/format.js';

// TODO filter for specific transactions, amount, incoming, outgoing?
const program = new Command();
program
  .addOption(options.account)
  .description(
    `Subscribe to new transactions and output each new transaction in JSON ` +
      `for further processing. Press CTRL+C to stop the process.`,
  )
  .addHelpText(
    'after',
    `
Examples:
  Show each incoming transaction:
    ${BIN_NAME} watch

  Selective display of fields
    ${BIN_NAME} watch | jq -c  '[{bookingDateF,amountF,name,personalNote}]'
  `,
  )
  .action(run)
  .parseAsync();

const onNext = (transaction: Transaction) => {
  process.stdout.write(
    JSON.stringify(formatTransaction(config, transaction)) + '\r\n',
  );
};
const onError = (error: Error) => console.error(error);

async function run() {
  const options = program.opts<{ account: string }>();
  const client = await createAccountClient(options.account, config);
  await client.models.transaction.subscribe(onNext, onError);
}
