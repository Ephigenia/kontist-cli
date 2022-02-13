import { Argument, InvalidOptionArgumentError } from 'commander';
import { parseAmount, parseIban } from './option-parser';

export default {
  amount: new Argument(
    '<amount>',
    'The amount of the transfer in cents (f.e. 2134 are 21.34)',
  ).argParser(parseAmount),
  cardId: new Argument('<cardId>', 'card identification id'),
  clientId: new Argument('<clientId>', 'Kontist OAuth client id'),
  e2eId: new Argument('[e2eId]', 'end-to-end id/reference string').argParser(
    (val: string): string => {
      if (val.length > 35)
        throw new InvalidOptionArgumentError('To long e2eid');
      return val;
    },
  ),
  iban: new Argument(
    '<iban>',
    'International Bank Account Number (IBAN)',
  ).argParser(parseIban),
  pin: new Argument('<pin>'),
  purpose: new Argument(
    '[purpose]',
    'The purpose of the transfer - 140 max characters',
  ).argParser((val: string): string => {
    if (val.length > 140)
      throw new InvalidOptionArgumentError('To long purpose');
    return val;
  }),
  query: new Argument('[query]', 'string to search in the transactions'),
  recipient: new Argument('[recipient]', 'The name of the transfer recipient'),
  username: new Argument(
    '<username>',
    'kontist usernamer, usually an email address',
  ),
};
