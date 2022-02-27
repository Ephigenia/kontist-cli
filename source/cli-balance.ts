#!/usr/bin/env node
import { Command } from 'commander';

import config from './lib/config';
import options from './lib/options';
import { BIN_NAME } from './lib/constants';
import { createAccountClient } from './lib/client';
import { formatCurrency } from './lib/format';
import { OutputFormat, print, printF } from './lib/output';

const program = new Command();
program
  .description(
    'Print the currently available balance of the configured account while ' +
      'using the configured currency (defaults to "EUR") and the systems ' +
      'default locale when formatting the value.',
  )
  .addOption(options.account)
  .addOption(options.plain)
  .addHelpText(
    'after',
    `
Examples:

  Use a different locale for formatting the number:
    LC_ALL=de-de ${BIN_NAME} balance

  Just print the available balance without any formatting
    ${BIN_NAME} balance --plain
  `,
  )
  .action(run)
  .parseAsync();

async function run() {
  const options = program.opts<{ account: string; plain: boolean }>();
  const client = await createAccountClient(options.account, config);
  const accountInfo = await client.models.account.get();
  if (!accountInfo) {
    throw new Error('Unable to get account info');
  }
  // TODO balance
  const { availableBalance } = accountInfo;

  if (options.plain) {
    print(availableBalance);
    process.exit(0);
  }

  return printF(
    OutputFormat.TEXT,
    '%s\n',
    formatCurrency(
      availableBalance,
      config.get('locale') as string,
      config.get('currency') as string,
    ),
  );
}
