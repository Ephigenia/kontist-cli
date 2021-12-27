#!/usr/bin/env node
import { Command } from 'commander';

import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';

const program = new Command();
program
  .description(
    `TODO`
  )
  .action(run)
  .parseAsync();

const onNext = (transaction) => {
  console.log(new Date(), 'transaction', transaction);
  return true;
};

const onError = (error) => {
  console.log(new Date(), 'error', error);
};


async function run() {
  const client = await createDefaultClient(config.get());
  console.log('starting to listen for new transaction(s)');


  const start = Date.now();
  const ping = setInterval(() => {
    const elapsedMs = Date.now() - start;
    console.log('%s %s', new Date(), (elapsedMs / 60_000).toPrecision(2));
  }, 10_000);

  const { unsubscribe } = await client.models.transaction.subscribe(onNext, onError);
};
