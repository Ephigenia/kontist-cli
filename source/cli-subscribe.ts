#!/usr/bin/env node
import { Command } from 'commander';
import { Transaction } from 'kontist/dist/lib/graphql/schema';

import { createDefaultClient } from './lib/client';
import config from './lib/config';

const program = new Command();
program.description(`TODO`).action(run).parseAsync();

const onNext = (transaction: Transaction) => {
  console.log(new Date(), 'transaction', transaction);
  return true;
};

const onError = (error: Error) => {
  console.log(new Date(), 'error', error);
};

async function run() {
  const client = await createDefaultClient(config);
  console.log('starting to listen for new transaction(s)');

  const start = Date.now();
  setInterval(() => {
    const elapsedMs = Date.now() - start;
    console.log('%s %s', new Date(), (elapsedMs / 60_000).toPrecision(2));
  }, 10_000);

  await client.models.transaction.subscribe(onNext, onError);
}
