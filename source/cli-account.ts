#!/usr/bin/env node
import { Command } from 'commander';

import config from './lib/config';
import options from './lib/options';
import arguments from './lib/arguments';
import { createAccountClient } from './lib/client.js';
import { BIN_NAME } from './lib/constants.js';
import { OutputFormat, print, printF } from './lib/output';

const program = new Command();
program
  .passThroughOptions()
  .command('login', 'add an account by login', { executableFile: 'cli-login' });

program
  .command('list')
  .description('list all accounts')
  .addHelpText(
    'after',
    `
Examples:
  List all accounts
    ${BIN_NAME} account list

  List all accounts and show as table
    ${BIN_NAME} account list | ctp -s
  `,
  )
  .action(async () => {
    const aliases = config.get('accounts').map((a) => ({
      name: a.name,
      clientId: a.clientId,
      clientSecret: a.clientSecret?.substring(0, 4) + '…',
    }));
    printF(OutputFormat.JSON, aliases);
  });

program
  .command('delete')
  .addArgument(arguments.accountAlias)
  .description('delete an account by alias')
  .addHelpText(
    'after',
    `
Examples:
  Delete an account
    ${BIN_NAME} account delete myalias
  `,
  )
  .action(async (alias: string) => {
    const accountConfig = config.findAccountByAlias(alias);
    if (!accountConfig) {
      print(`Unable to find an account ${JSON.stringify(alias)}.`);
      process.exit(1);
    }
    config.deleteAccountByAlias(alias);
    print(`Successfully deleted account ${JSON.stringify(alias)}.`);
    process.exit(0);
  });

program
  .description('get account information, IBAN, BIC, balance …')
  .addOption(options.account)
  .addHelpText(
    'after',
    `
Examples:
  Get current financial status
    ${BIN_NAME} status

  Get status for a specific account
    ${BIN_NAME} status --account company
  `,
  )
  .action(run)
  .parseAsync();

async function run() {
  const opts = program.opts();
  const client = await createAccountClient(opts.account, config);
  const account = await client.models.account.get();
  printF(OutputFormat.JSON, account);
}
