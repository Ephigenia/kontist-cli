#!/usr/bin/env node
import { Command } from 'commander';
import readlineSync from 'readline-sync';
import { CardAction } from 'kontist/dist/lib/graphql/schema';

import config from './lib/config';
import args from './lib/arguments';
import options from './lib/options';
import { createAccountClient } from './lib/client.js';
import { OutputFormat, printF } from './lib/output.js';

const program = new Command();
program.command('list', 'list all cards', { executableFile: 'cli-cards-list' });

program
  .command('pin')
  .addOption(options.account)
  .addArgument(args.cardId)
  .addArgument(args.pin)
  .action(async (cardId, pin) => {
    const options = program.opts<{ account: string }>();
    const client = await createAccountClient(options.account, config);
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
  .addOption(options.account)
  .addArgument(args.cardId)
  .action(async (cardId) => {
    const options = program.opts<{ account: string }>();
    const client = await createAccountClient(options.account, config);
    const result = await client.models.card.changeStatus({
      id: cardId,
      action: CardAction.Block,
    });
    return printF(OutputFormat.JSON, result);
  });

program
  .command('unblock')
  .addOption(options.account)
  .addArgument(args.cardId)
  .action(async (cardId) => {
    const options = program.opts<{ account: string }>();
    const client = await createAccountClient(options.account, config);
    const result = await client.models.card.changeStatus({
      id: cardId,
      action: CardAction.Unblock,
    });
    return printF(OutputFormat.JSON, result);
  });

program
  .description('get card information & limits')
  .addOption(options.account)
  .addArgument(args.cardId)
  .action(async (cardId) => {
    const options = program.opts<{ account: string }>();
    const client = await createAccountClient(options.account, config);
    const card = await client.models.card.get({ id: cardId });
    const limits = await client.models.card.getLimits({ id: cardId });
    return printF(OutputFormat.JSON, { limits, card });
  })
  .parseAsync();
