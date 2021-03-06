#!/usr/bin/env node
import { Command } from 'commander';
import { Client } from 'kontist';
import * as readlineSync from 'readline-sync';
import * as fs from 'node:fs/promises';

import config from './lib/config';
import args from './lib/arguments';
import options from './lib/options';
import { BIN_NAME } from './lib/constants';
import { print } from './lib/output';

const program = new Command();
program
  .addArgument(args.clientId)
  .addArgument(args.username)
  .addOption(options.password)
  .addOption(options.account)
  .addOption(options.secret)
  .addHelpText(
    'after',
    `
Examples:
  Login with user-prompt for password
    ${BIN_NAME} 12c03e59-b6da-4bf1-a1d7-2510690db95c email@host.de

  Login with with (random) password
    pwgen 20 1 | xargs echo | ${BIN_NAME} 12c03e59-b6da-4bf1-a1d7-2510690db95c email@host.de --password secret

  Unsafe password pass
    ${BIN_NAME} 12c03e59-b6da-4bf1-a1d7-2510690db95c email@host.de
  `,
  )
  .action(run)
  .parseAsync();

async function run(clientId: string, username: string) {
  const options = program.opts();

  let { password } = program.opts();
  // check if the password was set using cli options, if not, determine
  // if it was piped into the program and ask for it otherwise
  if (!password) {
    // detect if there’s any input piped into the program and use this input
    // as password
    if (process.stdin.isTTY === undefined) {
      password = await fs.readFile('/dev/stdin', 'utf-8');
      // replace the line break at the end of the string when "echoing" the
      // password
      password = password.replace(/\n$/, '');
    } else {
      password = readlineSync.question('Enter password: ');
    }
  }

  const client = new Client({
    clientId,
    clientSecret: options.clientSecret,
    scopes: config.get('scopes') as string[],
  });

  const parameters = {
    username,
    password,
  };

  const tokenData = await client.auth.tokenManager.fetchTokenFromCredentials(
    parameters,
  );
  print('Your unconfirmed access token is: %s\n', tokenData.accessToken);
  print('starting MFA ... verfiy the login with your mobile device\n');

  const confirmed = await client.auth.push.getConfirmedToken();
  print('Your confirmed access token is:\n', confirmed.accessToken);

  const accountConfiguration = {
    accessToken: confirmed.accessToken,
    clientId,
    ...(options.clientSecret && { clientSecret: options.clientSecret }),
    refreshToken: confirmed.refreshToken,
  };
  config.addAccount(options.account, accountConfiguration);

  print('successfully updated the configuration\n');
}
