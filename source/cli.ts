#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .version('0.0.0')
  .description('CLI interface for kontist')
  .command('balance', 'currently available balance', {
    executableFile: 'cli-balance',
  })
  .alias('show')
  .command('cards', 'list and modify cards', {
    executableFile: 'cli-cards',
  })
  .command('login', 'configuration of login & authorization', {
    executableFile: 'cli-login',
  })
  .command('subscribe', 'subscribe for new transactions', {
    executableFile: 'cli-subscribe',
  })
  .alias('watch')
  .command('transactions', 'list transactions', {
    executableFile: 'cli-transactions',
    isDefault: true,
  })
  .alias('list')
  .command('transfer', 'money transfer, timed, standing', {
    executableFile: 'cli-transfer',
  })
  .parse();
