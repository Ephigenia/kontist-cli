#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants';
import { createDefaultClient } from './lib/client';
import { formatTransaction } from './lib/format';
import config from './lib/config';
import { OutputFormat, printF } from './lib/output';
import options from './lib/options';
import args from './lib/arguments';

const program = new Command();
program
  .description(`list transaction`)
  // TODO add capability of using TransactionFilter properties
  .addArgument(args.query)
  // TODO add pagination
  .addOption(options.limit)
  .addHelpText(
    'after',
    `
Examples:
  Search for transactions
    ${BIN_NAME} transactions -q "IKEA"

  Limit the number of transactions
    ${BIN_NAME} transactions --limit 5

  Use JSTBL for selective display as table
    ${BIN_NAME} transactions | jstbl show:valutaDateF,amountF,name,purpose

  Transform JSON to tabular output using jq and table-printer-cli
    ${BIN_NAME} transactions | jq -c 'map({valutaDateF,amountF,name,purpose})' | ctp -s

  Use a different locale for formatting the monetary values:
    LC_ALL=de-de ${BIN_NAME} transactions

  Use different date time format
    LC_TIME=de-de ${BIN_NAME} transactions

  Get the IDs of transactions (f.e. for using with xargs)
    ${BIN_NAME} transactions IKEA | jq -r -c '.[].id'
  `,
  )
  .action(run)
  .parseAsync();

async function run(query?: string) {
  const options = program.opts();

  const client = await createDefaultClient(config);
  let transactionList;
  if (query) {
    transactionList = await client.models.transaction.search(query);
  } else {
    // TODO catch graphql error when limit is not in range between 0 and 50
    const queryArguments = {
      ...(typeof options.limit === 'number' && { first: options.limit }),
    };
    transactionList = await client.models.transaction.fetch(queryArguments);
  }

  const items = transactionList.items.map((t) => formatTransaction(config, t));
  printF(OutputFormat.JSON, items);
}
