import Conf from 'conf';

const SCOPES_DEFAULT = [
  'accounts',
  'offline',
  'statements',
  'subscriptions',
  'transactions',
  'transfers',
  'users',
];

// schema definition for validating configuration values
// SEE https://json-schema.org/understanding-json-schema/
const schema = {
  accessToken: {
    type: 'string',
  },
  clientId: {
    type: 'string',
  },
  currency: {
    // ISO 4217 currency symbol used for formating money values
    type: 'string',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]{3}$',
    default: 'EUR',
  },
  locale: {
    // optional locale to be used when formatting money values
    type: 'string',
  },
  refreshToken: {
    type: 'string',
  },
  scopes: {
    type: 'array',
    default: SCOPES_DEFAULT,
    items: {
      type: 'string',
      minLength: 1,
    },
  },
  timeZone: {
    type: 'string',
  }
};

const config = new Conf({
  projectName: 'kontist-cli-dev',
  projectVersion: '0.0.0-dev',
  schema,
});

export default config;
