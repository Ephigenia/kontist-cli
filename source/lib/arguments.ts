import { Argument } from 'commander';
import { parseAmount, parseIban } from './option-parser';

export default {
  amount: new Argument(
    '<amount>',
    'amount in cents (f.e. 2134 are 21.34)',
  ).argParser(parseAmount),
  cardId: new Argument('<cardId>', 'cardId'),
  clientId: new Argument('<clientId>', 'kontist oauth client id'),
  iban: new Argument('<iban>', 'IBAN').argParser(parseIban),
  query: new Argument('[query]', 'string to search in the transactions'),
  username: new Argument(
    '<username>',
    'kontist usernamer, usually an email address',
  ),
};
