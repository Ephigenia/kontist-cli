#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .version('0.0.0')
  .description('lorem ipsum')
  .command('balance', 'currently available balance', {
    executableFile: 'cli-balance',
  })
  .command('login', 'configuration of login & authorization', {
    executableFile: 'cli-login',
  })
  .command('subscribe', 'TODO', { executableFile: 'cli-subscribe' })
  .command('transactions', 'list transactions', {
    executableFile: 'cli-transactions',
    isDefault: true,
  })
  .command('transfer', 'money transfer, timed, standing', {
    executableFile: 'cli-transfer',
  })
  .parse();
