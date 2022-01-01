#!/usr/bin/env node
import { Command } from 'commander';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';
import { BIN_NAME } from './lib/constants.js';
import { formatTransaction } from './lib/format.js';

// TODO filter for specific transactions, amount, incoming, outgoing?

const program = new Command();
program
  .description(
    `Subscribe to new transactions and output each new transaction in JSON ` +
    `for further processing. Press CTRL+C to stop the process.`
  )
  .addHelpText('after', `
Examples:
  Show each incoming transaction:
    ${BIN_NAME} watch

  Selective display of fields
    ${BIN_NAME} watch | jq -c  '[{bookingDateF,amountF,name,personalNote}]'
  `)
  .action(run)
  .parseAsync();


const onNext = (transaction) => {
  process.stdout.write(
    JSON.stringify(
      formatTransaction(config, transaction)
    ) + "\r\n"
  );
}
const onError = (error) => console.error(error);

async function run() {
  const client = await createDefaultClient(config.get());
  const { unsubscribe } = await client.models.transaction.subscribe(onNext, onError);
};
