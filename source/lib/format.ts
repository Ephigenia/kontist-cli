import Conf from 'conf/dist/source';
import { Transaction } from 'kontist/dist/lib/graphql/schema';
import { KontistConfiguration } from './config';

export function formatCurrency(
  value: number,
  locale: string,
  currency?: string,
) {
  // format the value
  const options = {
    currency,
    style: 'currency',
  };
  return (value / 100).toLocaleString(locale, options);
}

export function formatDateTime(
  value: string | number | Date,
  locale: string,
  options?: object,
) {
  return new Date(value).toLocaleString(locale, options);
}

export function formatTransaction(
  config: Conf<KontistConfiguration>,
  transaction: Transaction,
) {
  const locale = config.get('locale') as string;
  const currency = config.get('currency') as string;
  return {
    // TODO IBAN formatter
    ...transaction,
    amountF: formatCurrency(transaction.amount, locale, currency),
    bookingDateF: formatDateTime(transaction.bookingDate, locale),
    createdAtF: formatDateTime(transaction.createdAt, locale),
    valutaDateF: formatDateTime(transaction.valutaDate, locale),
  };
}
