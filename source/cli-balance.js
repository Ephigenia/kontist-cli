#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import { createDefaultClient } from './lib/client.js';
import { formatCurrency } from './lib/format.js';
import config from './lib/config.js';

const program = new Command();
program
  .description(
    'Print the currently available balance of the configured account while ' +
    'using the configured currency (defaults to "EUR") and the systems ' +
    'default locale when formatting the value.'
  )
  .option('--plain', 'no formatting, just print the available balance')
  // TODO add option to disable number formatting and plain print the value
  //      for easy use in shell scripts
  .addHelpText('after', `
Examples:

  Use a different locale for formatting the number:
    LC_ALL=de-de ${BIN_NAME} balance

  Just print the available balance without any formatting
    ${BIN_NAME} balance --plain
  `)
  .action(run)
  .parseAsync();

async function run() {
  const opts = program.opts();
  const client = await createDefaultClient(config.get());
  const accountInfo = await client.models.account.get();

  // TODO check if "availableBalance" matches "balance" and
  //      show it somehow in the output
  // TODO add a notification when there’s a card fraud in progress?
  const { balance, availableBalance } = accountInfo;

  if (opts.plain) {
    console.log(availableBalance);
    process.exit(0);
  }

  console.log(formatCurrency(availableBalance, config.get('locale'), config.get('currency')));
};
