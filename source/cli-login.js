#!/usr/bin/env node
import { Command } from 'commander';
import { Client } from 'kontist';
import readlineSync from 'readline-sync';
import fs from 'node:fs/promises';

import config from './lib/config.js';

const program = new Command();
program
  .arguments('<clientId> <username>', {
    'clientId': 'kontist oauth client id',
    'username': '',
  })
  .option('-p, --password <password>', 'acccount password, better: consider tty in password, see examples')
  .option('-s, --secret <clientSecret>', 'optional oauth client secret to be used')
  // TODO add optional option to set scopes (which may be not correct)
  .addHelpText('after', `
Examples:
  Login with user-prompt for password
    ${BIN_NAME} 12c03e59-b6da-4bf1-a1d7-2510690db95c email@host.de

  Login with with (random) password
    pwgen 20 1 | xargs echo | ${BIN_NAME} 12c03e59-b6da-4bf1-a1d7-2510690db95c email@host.de --password stupid

  Unsafe password pass
    ${BIN_NAME} 12c03e59-b6da-4bf1-a1d7-2510690db95c email@host.de
  `)
  .action(run)
  .parseAsync();

async function run(clientId, username) {
  const { clientSecret } = program.opts();

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
    clientSecret,
    scopes: config.get('scopes'),
  });

  const parameters = {
    username,
    password,
  };

  const tokenData = await client.auth.tokenManager.fetchTokenFromCredentials(parameters);
  console.log('Your unconfirmed access token is: %s', tokenData.accessToken);
  console.log('starting MFA ... verfiy the login with your mobile device');

  const confirmed = await client.auth.push.getConfirmedToken();
  // TODO update configuration when valid
  console.log("Your confirmed access token is:", confirmed.accessToken);

  config.set({
    accessToken: confirmed.accessToken,
    clientId,
    ...(clientSecret && { clientSecret }),
    refreshToken: confirmed.refreshToken,
  });

  console.log('successfully updated the configuration');
};
