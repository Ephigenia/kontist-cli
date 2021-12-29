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
  .option('--plain', 'no formatting, just print the available balance in cents')
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
  const options = program.opts();
  const client = await createDefaultClient(config.get());
  const accountInfo = await client.models.account.get();

  const { balance, availableBalance } = accountInfo;

  if (options.plain) {
    console.log(availableBalance);
    process.exit(0);
  }

  console.log(formatCurrency(availableBalance, config.get('locale'), config.get('currency')));
};
