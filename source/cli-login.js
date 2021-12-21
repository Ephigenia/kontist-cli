#!/usr/bin/env node
import { Command } from 'commander';
import { Client } from 'kontist';

import config from './lib/config.js';

const program = new Command();
program
  .option('-u, --username <username>')
  // TODO add prompt for password not beeing passed via CLI
  // TODO add note that passing the password via cli is not safe
  // TODO add option to pipe in the password
  .option('-p, --password <password>')
  .option('-s, --secret <clientSecret>')
  .option('-c, --clientId <clientId>')
  .action(run)
  .parseAsync();

async function run() {
  const { clientId, clientSecret, username, password } = program.opts();

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
