#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import readlineSync from 'readline-sync';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';

const program = new Command();
program
  .command('list', 'list all cards', { executableFile: 'cli-cards-list'});

program
  .command('pin')
  .arguments('<cardId> <pin>')
  .action(async (cardId, pin) => {
    const client = await createDefaultClient(config.get());
    const confirmationId = await client.models.card.changePIN({ id: cardId, pin });

    const authorizationToken = readlineSync.question('Enter OTP ');
    const data = await client.models.card.confirmChangePIN({
      authorizationToken,
      confirmationId,
      id: cardId,
    });
    console.log(JSON.stringify(data));
  });

program
  .command('block')
  .arguments('<cardId>')
  .action(async (cardId) => {
    const client = await createDefaultClient(config.get());
    const result = await client.models.card.changeStatus({ id: cardId, action: 'BLOCK' });
    console.log(JSON.stringify(result));
  });

program
  .command('unblock')
  .arguments('<cardId>')
  .action(async (cardId) => {
    const client = await createDefaultClient(config.get());
    const result = await client.models.card.changeStatus({ id: cardId, action: 'UNBLOCK' });
    console.log(JSON.stringify(result));
  });

program
  .description('get card information & limits')
  .arguments('<cardId>')
  .action(async (cardId) => {
    const client = await createDefaultClient(config.get());
    const card = await client.models.card.get({ id: cardId });
    const limits = await client.models.card.getLimits({ id: cardId });
    console.log(JSON.stringify({ limits, card }));
  })
  .parseAsync();
