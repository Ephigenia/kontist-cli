#!/usr/bin/env node
import { Command } from 'commander';

import * as package_ from '../package.json';

const program = new Command();

program
  .version(package_.version)
  .description(package_.description)
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
