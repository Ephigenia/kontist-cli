import { Client } from 'kontist';

import { BIN_NAME } from './constants.js';

class ApplicationError extends Error {}
class ApplicationConfigurationError extends ApplicationError {}
class ApplicationMissingConfigurationError extends ApplicationConfigurationError {
  constructor(variableName) {
    super(
      `The application requires the configuration ${variableName} to be `+
      `properly defined. Please check \`${BIN_NAME} login\` to set ` +
      `everything up.`);
  }
}

async function createDefaultClient(config) {
  const requiredVars = ['clientId', 'accessToken', 'refreshToken'];
  requiredVars.forEach((varname) => {
    if (config[String(varname)]) return;
    throw new ApplicationMissingConfigurationError(varname);
  });

  const client = new Client({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    scopes: config.scopes,
  });

  // use the access and refresh token from the configuration
  client.auth.tokenManager.setToken(config.accessToken, config.refreshToken);
  const token = await client.auth.tokenManager.refresh();

  return client;
}

export { createDefaultClient };
