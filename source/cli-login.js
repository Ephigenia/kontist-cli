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
  const opts = program.opts();

  const client = new Client({
    clientId: opts.clientId,
    clientSecret: opts.clientSecret,
    scopes: config.get('scopes'),
  });

  const params = {
    username: opts.username,
    password: opts.password,
  };

  const tokenData = await client.auth.tokenManager.fetchTokenFromCredentials(params);
  console.log('Your unconfirmed access token is: %s', tokenData.accessToken);
  console.log('starting MFA ... verfiy the login with your mobile device');

  const confirmed = await client.auth.push.getConfirmedToken();
  // TODO update configuration when valid
  console.log("Your confirmed access token is:", confirmed.accessToken);

  config.set({
    accessToken: confirmed.accessToken,
    clientId: opts.clientId,
    ...(opts.clientSecret && { clientSecret: opts.clientSecret }),
    refreshToken: confirmed.refreshToken,
  });

  console.log('successfully updated the configuration');
};
