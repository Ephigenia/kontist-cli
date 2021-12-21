#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import { createDefaultClient } from './lib/client.js';
import { formatTransaction } from './lib/format.js';
import config from './lib/config.js';

const program = new Command();
program
  // TODO add option to reverse the ordering
  // TODO add pagination
  .arguments('[query]', {
    query: 'optional string to search in the transactions'
  })
  .description(
    `TODO`
  )
  .addHelpText('after', `
Examples:
  Search for transactions
    ${BIN_NAME} transactions -q "IKEA"

  Transform JSON to tabular output using jq and table-printer-cli
    ${BIN_NAME} transactions | jq -c 'map({bookingDateF,valutaDateF,amountF,name,category,personalNote})' | npx table-printer-cli -s

  Use a different locale for formatting the monetary values:
    LC_ALL=de-de ${BIN_NAME} transactions

  Use different date time format
    LC_TIME=de-de ${BIN_NAME} transactions

  Get the IDs of transactions (f.e. for using with xargs)
    ${BIN_NAME} transactions IKEA | jq -r -c '.[].id'
  `)
  .action(run)
  .parseAsync();

async function run(query) {
  const client = await createDefaultClient(config.get());
  const transactionList = await client.models.transaction[query ? 'search' : 'fetch'](query);
  const items = transactionList.items.map(formatTransaction.bind(this, config));
  console.log(JSON.stringify(items));
};
