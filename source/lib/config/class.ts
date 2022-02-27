import Conf from 'conf';
import { ok } from 'node:assert';
import { ApplicationConfigurationError } from './../client';
import { BIN_NAME } from './../constants';
import { KontistAccountConfiguration, KontistConfiguration } from './schema';

export class ApplicationUnknownAccountNameError extends ApplicationConfigurationError {
  constructor(accountName: string) {
    const message =
      `Unable to find an account configuration for ${JSON.stringify(
        accountName,
      )}. ` + `Please use \`${BIN_NAME} account add\` to create it.`;
    super(message);
    this.name = 'ApplicationMissingConfigurationError';
  }
}

export class ApplicationDublicateAccountNameError extends ApplicationConfigurationError {
  constructor(accountName: string) {
    const message = `There already is an account defined: ${JSON.stringify(
      accountName,
    )}.`;
    super(message);
    this.name = 'ApplicationMissingConfigurationError';
  }
}

export class KontistCliConfiguration extends Conf<KontistConfiguration> {
  addAccount(name: string, config: Partial<KontistAccountConfiguration>) {
    ok(name, `Expected "name" to be a non-empty string`);
    if (this.findAccountByAlias(name)) {
      throw new ApplicationDublicateAccountNameError(name);
    }
    this.set('accounts', [...this.get('accounts'), { ...config, name }]);
    return this;
  }

  getAccountByAlias(alias: string): KontistAccountConfiguration {
    const accountConfig = this.findAccountByAlias(alias);
    if (!accountConfig) {
      throw new ApplicationUnknownAccountNameError(alias);
    }
    return accountConfig;
  }

  findAccountByAlias(alias: string): KontistAccountConfiguration | undefined {
    return this.get('accounts').find(({ name }) => name === alias);
  }

  deleteAccountByAlias(alias: string) {
    this.set(
      'accounts',
      this.get('accounts').filter(({ name }) => name !== alias),
    );
    return this;
  }
}
