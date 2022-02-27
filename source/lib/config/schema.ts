import { Schema } from 'conf';

export interface KontistAccountConfiguration {
  name: string;
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret?: string;
}

export interface KontistConfiguration {
  accounts: KontistAccountConfiguration[];
  currency?: string;
  locale: string;
  scopes?: string[];
  timeZone: string;
}

export const SCOPES_DEFAULT = [
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
export const schema: Schema<KontistConfiguration> = {
  accounts: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
        clientId: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        refreshToken: {
          type: 'string',
        },
      },
    },
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
  },
};
