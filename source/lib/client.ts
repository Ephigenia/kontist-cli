import Conf from 'conf/dist/source';
import { Client } from 'kontist';
import { KontistConfiguration } from './config';
import { BIN_NAME } from './constants';

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}
export class ApplicationConfigurationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationConfigurationError';
  }
}
export class ApplicationMissingConfigurationError extends ApplicationConfigurationError {
  constructor(variableName: string) {
    const message =
      `The application requires the configuration ${variableName} to be ` +
      `properly defined. Please check \`${BIN_NAME} login\` to set ` +
      `everything up.`;
    super(message);
    this.name = 'ApplicationMissingConfigurationError';
  }
}

export async function createDefaultClient(config: Conf<KontistConfiguration>) {
  const requiredVariables = ['clientId', 'accessToken', 'refreshToken'];
  for (const varname of requiredVariables) {
    const value = config.get(varname);
    if (value) continue;
    throw new ApplicationMissingConfigurationError(varname);
  }

  const client = new Client({
    clientId: config.get('clientId'),
    clientSecret: config.get('clientSecret'),
    scopes: config.get('scopes'),
  });

  // use the access and refresh token from the configuration
  client.auth.tokenManager.setToken(
    config.get('accessToken'),
    config.get('refreshToken'),
  );
  await client.auth.tokenManager.refresh();

  return client;
}
