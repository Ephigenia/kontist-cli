#!/usr/bin/env node
import { Command } from 'commander';
import {
  AccountTransfersArgs,
  TransferStatus,
  TransferType,
} from 'kontist/dist/lib/graphql/schema';

import config from './lib/config';
import options from './lib/options';
import { BIN_NAME } from './lib/constants.js';
import { createAccountClient } from './lib/client.js';
import { printF, OutputFormat } from './lib/output';

const program = new Command();
program
  .description('list transfers')
  .passThroughOptions()
  .addOption(options.account)
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
  const options = program.opts<{
    account: string;
    dryRun: boolean;
    limit: number;
    status: TransferStatus;
  }>();
  const client = await createAccountClient(options.account, config);

  const params: AccountTransfersArgs = {
    type: TransferType.SepaTransfer,
    first: options.limit,
    ...(options.status && {
      where: {
        status: options.status,
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
