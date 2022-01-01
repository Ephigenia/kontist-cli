#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';

const program = new Command();
program
  // TODO add filter for filtering cards?
  .action(run)
  .description('list available cards')
  .addHelpText('after', `
Examples:
  List all cards
    ${BIN_NAME} cards list

  List all card ids
    ${BIN_NAME} cards list | jq -r '.[].id'

  List cards in tabular display
    ${BIN_NAME} cards list kont| npx table-printer-cli -s
`)
  .parseAsync();

async function run(cardId) {
  const client = await createDefaultClient(config.get());
  const cards = await client.models.card.fetch();

  // TODO status ACTIVE … and others should be visible

  console.log(JSON.stringify(cards.items));
};
