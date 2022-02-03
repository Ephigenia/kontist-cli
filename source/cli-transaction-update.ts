#!/usr/bin/env node

import { program } from "commander";

import { MutationUpdateTransactionArgs } from "kontist/dist/lib/graphql/schema";
import { createDefaultClient } from "./lib/client";
import config from "./lib/config";
import { OutputFormat, printF } from "./lib/output";
console.log('hello marcel');
program
  .description('update a single transaction')
  .arguments('<transactionId>')
  .action(async (transactionId) => {
    console.log('update a single transaction with the id %s', transactionId);
    const client = await createDefaultClient(config);
    const params:MutationUpdateTransactionArgs = {
      id: transactionId
    };
    const result = await client.models.transaction.update(params);
    return printF(OutputFormat.JSON, result);
  });
