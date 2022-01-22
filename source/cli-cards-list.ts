#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';
import { printF, OutputFormat } from './lib/output';

const program = new Command();
program
  .description('list available cards')
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
  const client = await createDefaultClient(config);
  const cards = await client.models.card.fetch();

  // TODO status ACTIVE … and others should be visible
  return printF(OutputFormat.JSON, cards.items);
}
