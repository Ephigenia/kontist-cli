#!/usr/bin/env node
import { Command } from 'commander';

import config from './lib/config';
import options from './lib/options';
import { BIN_NAME } from './lib/constants.js';
import { createAccountClient } from './lib/client';
import { printF, OutputFormat } from './lib/output';

const program = new Command();
program
  .description('list available cards')
  .addOption(options.account)
  .addHelpText(
    'after',
    `
Examples:
  List all cards
    ${BIN_NAME} cards list

  List all card ids
    ${BIN_NAME} cards list | jstbl

  List cards in tabular display
    ${BIN_NAME} cards list kont| npx table-printer-cli -s
`,
  )
  .action(main)
  .parseAsync();

async function main() {
  const options = program.opts<{ account: string }>();
  const client = await createAccountClient(options.account, config);
  const cards = await client.models.card.fetch();

  // TODO status ACTIVE … and others should be visible
  return printF(OutputFormat.JSON, cards.items);
}
