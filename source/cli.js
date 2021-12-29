#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';

const program = new Command();

program
  .version('0.0.0')
  .command('balance', 'currently available balance', { executableFile: 'cli-balance' })
  .command('login', 'configuration of login & authorization', { executableFile: 'cli-login'})
  .command('transfer', 'money transfer, timed, standing', { executableFile: 'cli-transfer' })
  .command('transactions', 'list transactions', { executableFile: 'cli-transactions', isDefault: true })
  .parse();
