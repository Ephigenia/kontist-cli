#!/usr/bin/env node
import { Command } from 'commander';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';
import { BIN_NAME } from './lib/constants.js';

// TODO filter for specific transactions, amount, incoming, outgoing?
const program = new Command();
program
  .description(``)
  .addHelpText(
    'after',
    `
Examples:
  Lorem Ipusm
    ${BIN_NAME} status
  `,
  )
  .action(run)
  .parseAsync();

async function run() {
  const client = await createDefaultClient(config);
  const account = await client.models.account.get();
  console.log(account);
}
