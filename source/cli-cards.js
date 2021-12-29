#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';

const program = new Command();

program
  .command('list', 'list all cards', { executableFile: 'cli-cards-list' })
  .parse();
