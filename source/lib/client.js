import { Client } from 'kontist';

import { BIN_NAME } from './constants.js';

class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApplicationError';
  }
}
class ApplicationConfigurationError extends ApplicationError {
  constructor(message) {
    super(message);
    this.name = 'ApplicationConfigurationError';
  }
}
class ApplicationMissingConfigurationError extends ApplicationConfigurationError {
  constructor(variableName) {
    const message =
      `The application requires the configuration ${variableName} to be ` +
      `properly defined. Please check \`${BIN_NAME} login\` to set ` +
      `everything up.`;
    super(message);
    this.name = 'ApplicationMissingConfigurationError';
  }
}

async function createDefaultClient(config) {
  const requiredVariables = ['clientId', 'accessToken', 'refreshToken'];
  for (const varname of requiredVariables) {
    if (config[String(varname)]) continue;
    throw new ApplicationMissingConfigurationError(varname);
  }

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
