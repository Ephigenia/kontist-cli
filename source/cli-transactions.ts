#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants';
import { createDefaultClient } from './lib/client';
import { formatTransaction } from './lib/format';
import config from './lib/config';
import { OutputFormat, printF } from './lib/output';
import options from './lib/options';
import args from './lib/arguments';
import {
  AccountTransactionsArgs,
  BaseOperator,
  TransactionFilter,
} from 'kontist/dist/lib/graphql/schema';

const program = new Command();
program
  .description(`list transaction`)
  .addArgument(args.query)
  // TODO add pagination
  .addOption(options.dryRun)
  .addOption(options.from)
  .addOption(options.limit)
  .addOption(options.to)
  .addOption(options.iban)
  .option('--outgoing', 'show only negative amounts')
  .option('--incoming', 'show only positive amounts')
  .addHelpText(
    'after',
    `
Examples:
  Search for transactions, like invoce numbers
    ${BIN_NAME} transactions -q "RN-2022-1"

  Limit the number of transactions
    ${BIN_NAME} transactions --limit 5

  In specific time frame
  ${BIN_NAME} transactions --from 2022-02-01 --to 2022-02-28

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

  // use options and arguments to bild the query arguments
  const transactionFilter: TransactionFilter = {};
  if (options.from) transactionFilter.bookingDate_gte = options.from;
  if (options.to) transactionFilter.bookingDate_lte = options.to;
  if (options.incoming) transactionFilter.amount_gt = 0;
  if (options.outgoing) transactionFilter.amount_lt = 0;
  if (options.iban) transactionFilter.iban_in = options.iban;
  if (query) {
    transactionFilter.conditions = [
      { iban_like: query, operator: BaseOperator.Or },
      { name_like: query, operator: BaseOperator.Or },
      { purpose_like: query, operator: BaseOperator.Or },
    ];
  }

  // TODO catch graphql error when limit is not in range between 0 and 50
  const queryArguments: AccountTransactionsArgs = {
    ...(typeof options.limit === 'number' && { first: options.limit }),
    filter: transactionFilter,
  };
  if (options.dryRun) {
    console.log(queryArguments);
    process.exit(0);
  }

  const transactionList = await client.models.transaction.fetch(queryArguments);

  const items = transactionList.items.map((t) => formatTransaction(config, t));
  printF(OutputFormat.JSON, items);
}
