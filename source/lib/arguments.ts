import { Argument } from 'commander';

export default {
  iban: new Argument('<iban>', 'IBAN'),
  cardId: new Argument('<cardId>', 'cardId'),
  clientId: new Argument('<clientId>', 'kontist oauth client id'),
  username: new Argument(
    '<username>',
    'kontist usernamer, usually an email address',
  ),
  query: new Argument('[query]', 'string to search in the transactions'),
};
