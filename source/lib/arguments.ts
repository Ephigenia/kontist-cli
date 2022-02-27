import { Argument, InvalidOptionArgumentError } from 'commander';
import {
  assertValidSEPAChars,
  parseAmount,
  parseIban,
  sanitizeSEPAChars,
} from './option-parser';

export default {
  accountAlias: new Argument('alias', 'name of the account'),
  amount: new Argument(
    'amount',
    'The amount of the transfer in cents (f.e. 2134 are 21.34)',
  )
    .argRequired()
    .argParser(parseAmount),
  cardId: new Argument('<cardId>', 'card identification id'),
  clientId: new Argument('<clientId>', 'Kontist OAuth client id'),
  e2eId: new Argument('e2eId', 'end-to-end id/reference string')
    .argOptional()
    .argParser((val: string): string => {
      val = sanitizeSEPAChars(val);
      if (val.length > 35)
        throw new InvalidOptionArgumentError('To long e2eid');
      assertValidSEPAChars(val);
      return val;
    }),
  iban: new Argument('iban', 'International Bank Account Number (IBAN)')
    .argRequired()
    .argParser(parseIban),
  pin: new Argument('pin').argRequired(),
  purpose: new Argument(
    'purpose',
    'The purpose of the transfer - 140 max characters',
  )
    .argOptional()
    .argParser((val: string): string => {
      val = sanitizeSEPAChars(val);
      if (val.length > 140)
        throw new InvalidOptionArgumentError('To long purpose');
      assertValidSEPAChars(val);
      return val;
    }),
  query: new Argument('[query]', 'string to search in the transactions'),
  recipient: new Argument('recipient', 'The name of the transfer recipient')
    .argOptional()
    .argParser((val: string): string => {
      val = sanitizeSEPAChars(val);
      assertValidSEPAChars(val);
      return val;
    }),
  username: new Argument(
    '<username>',
    'kontist usernamer, usually an email address',
  ),
};
