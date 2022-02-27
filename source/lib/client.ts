import { Client } from 'kontist';
import { KontistCliConfiguration } from './config/class';
import { KontistAccountConfiguration } from './config/schema';
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
      `The application requires the configuration ${JSON.stringify(
        variableName,
      )} to be ` +
      `properly defined. Please check \`${BIN_NAME} login\` to set ` +
      `everything up.`;
    super(message);
    this.name = 'ApplicationMissingConfigurationError';
  }
}

export function validateAccountConfig(
  accountConfig: KontistAccountConfiguration,
): boolean {
  const requiredVariables = ['clientId', 'accessToken', 'refreshToken'];
  for (const varname of requiredVariables) {
    const value = accountConfig[varname as keyof KontistAccountConfiguration];
    if (value) continue;
    throw new ApplicationMissingConfigurationError(varname);
  }
  return true;
}

export async function createAccountClient(
  accountName = 'default',
  config: KontistCliConfiguration,
) {
  const accountConfig = config.getAccountByAlias(accountName);
  validateAccountConfig(accountConfig);
  const client = new Client({
    clientId: accountConfig.clientId,
    clientSecret: accountConfig.clientSecret,
    scopes: config.get('scopes'),
  });
  // use the access and refresh token from the configuration
  client.auth.tokenManager.setToken(
    accountConfig.accessToken,
    accountConfig.refreshToken,
  );
  await client.auth.tokenManager.refresh();

  return client;
}
