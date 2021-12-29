#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';

const program = new Command();
program
  .action(run)
  .description('list available cards')
  .addHelpText('after', `
Examples:
  List all cards
    ${BIN_NAME} cards list
`)
  .parseAsync();

async function run() {
  const client = await createDefaultClient(config.get());
  const cards = await client.models.card.fetch();
  console.log(JSON.stringify(cards.items));
};
