import { Argument } from 'commander';
import { parseAmount, parseIban } from './option-parser';

export default {
  amount: new Argument(
    '<amount>',
    'amount in cents (f.e. 2134 are 21.34)',
  ).argParser(parseAmount),
  cardId: new Argument('<cardId>', 'card identification id'),
  clientId: new Argument('<clientId>', 'Kontist OAuth client id'),
  e2eId: new Argument('<e2eId>', 'end-to-end id/reference string'),
  iban: new Argument(
    '<iban>',
    'International Bank Account Number (IBAN)',
  ).argParser(parseIban),
  pin: new Argument('<pin>'),
  purpose: new Argument('[purpose]', 'optional purpose'),
  query: new Argument('[query]', 'string to search in the transactions'),
  recipient: new Argument('[recipient]', 'recipient name'),
  username: new Argument(
    '<username>',
    'kontist usernamer, usually an email address',
  ),
};
