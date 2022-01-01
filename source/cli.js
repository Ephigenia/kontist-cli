#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import { APP_VERSION } from './lib/constants.js';

const program = new Command();

program
  .version(APP_VERSION)
  .command('balance', 'currently available balance', { executableFile: 'cli-balance' })
  .command('cards', 'TODO cards', { executableFile: 'cli-cards' })
  .command('login', 'configuration of login & authorization', { executableFile: 'cli-login'})
  .command('watch', 'listen for new transactions', { executableFile: 'cli-watch' })
  .command('transactions', 'list transactions', { executableFile: 'cli-transactions', isDefault: true })
  .command('transfer', 'money transfer, timed, standing', { executableFile: 'cli-transfer' })
  .parse();
