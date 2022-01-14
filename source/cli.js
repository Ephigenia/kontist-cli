#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import { readFile } from 'node:fs/promises';

const program = new Command();
let package_ = JSON.parse(
  await readFile(
    new URL('./../package.json', import.meta.url)
  )
);

program
  .version(package_.version)
  .command('balance', 'currently available balance', { executableFile: 'cli-balance' })
  .command('login', 'configuration of login & authorization', { executableFile: 'cli-login'})
  .command('subscribe', 'TODO', { executableFile: 'cli-subscribe' })
  .command('transactions', 'list transactions', { executableFile: 'cli-transactions', isDefault: true })
  .command('transfer', 'money transfer, timed, standing', { executableFile: 'cli-transfer' })
  .parse();
