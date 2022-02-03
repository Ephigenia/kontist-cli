#!/usr/bin/env node
import { Command } from 'commander';
import readlineSync from 'readline-sync';
import { CardAction } from 'kontist/dist/lib/graphql/schema';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';
import { OutputFormat, printF } from './lib/output.js';
import args from './lib/arguments';

const program = new Command();
program.command('list', 'list all cards', { executableFile: 'cli-cards-list' });

program
  .command('pin')
  .addArgument(args.cardId)
  .arguments('<pin>')
  .action(async (cardId, pin) => {
    const client = await createDefaultClient(config);
    const confirmationId = await client.models.card.changePIN({
      id: cardId,
      pin,
    });

    const authorizationToken = readlineSync.question('Enter OTP ');
    const data = await client.models.card.confirmChangePIN({
      authorizationToken,
      confirmationId,
      id: cardId,
    });
    return printF(OutputFormat.JSON, data);
  });

program
  .command('block')
  .addArgument(args.cardId)
  .action(async (cardId) => {
    const client = await createDefaultClient(config);
    const result = await client.models.card.changeStatus({
      id: cardId,
      action: CardAction.Block,
    });
    return printF(OutputFormat.JSON, result);
  });

program
  .command('unblock')
  .addArgument(args.cardId)
  .action(async (cardId) => {
    const client = await createDefaultClient(config);
    const result = await client.models.card.changeStatus({
      id: cardId,
      action: CardAction.Unblock,
    });
    return printF(OutputFormat.JSON, result);
  });

program
  .description('get card information & limits')
  .addArgument(args.cardId)
  .action(async (cardId) => {
    const client = await createDefaultClient(config);
    const card = await client.models.card.get({ id: cardId });
    const limits = await client.models.card.getLimits({ id: cardId });
    return printF(OutputFormat.JSON, { limits, card });
  })
  .parseAsync();
