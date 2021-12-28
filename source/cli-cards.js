#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';

const program = new Command();
program
  .action(run)
  .parseAsync();

async function run(query) {
  const options = program.opts();

  const client = await createDefaultClient(config.get());
  const cards = await client.models.card.fetch();
  console.log(JSON.stringify(cards.items));
};
