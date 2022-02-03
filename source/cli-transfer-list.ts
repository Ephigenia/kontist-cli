#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import {
  AccountTransfersArgs,
  TransferStatus,
  TransferType,
} from 'kontist/dist/lib/graphql/schema';
import { createDefaultClient } from './lib/client.js';
import config from './lib/config.js';
import { printF, OutputFormat } from './lib/output';
import { options } from './lib/options';

const program = new Command();
program
  .description('list transfers')
  .passThroughOptions()
  .addOption(options.limit)
  .addOption(options.dryRun)
  .addOption(options.transferStatus)
  .addHelpText(
    'after',
    `
Examples:
  List all sheduled transfers
    ${BIN_NAME} transfer list --status SHEDULED

  List all executed
    ${BIN_NAME} transfer list --status EXECUTED
`,
  )
  .action(main)
  .parseAsync();

async function main() {
  const options = program.opts();
  const client = await createDefaultClient(config);

  const params: AccountTransfersArgs = {
    type: TransferType.SepaTransfer,
    first: options.limit,
    ...(options.status && {
      where: {
        status: options.status as TransferStatus,
      },
    }),
  };

  if (options.dryRun) {
    printF(OutputFormat.JSON, params);
    process.exit(0);
  }
  const [sepa, standing, timed, virtual] = await Promise.all([
    client.models.transfer.fetchAll({
      ...params,
      type: TransferType.SepaTransfer,
    }),
    client.models.transfer.fetchAll({
      ...params,
      type: TransferType.StandingOrder,
    }),
    client.models.transfer.fetchAll({
      ...params,
      type: TransferType.TimedOrder,
    }),
    client.models.transfer.fetchAll({
      ...params,
      type: TransferType.VirtualBooking,
    }),
  ]);

  // TODO status ACTIVE … and others should be visible
  return printF(OutputFormat.JSON, { sepa, standing, timed, virtual });
}
