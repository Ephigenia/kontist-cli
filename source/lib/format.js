function formatCurrency(value, locale, currency) {
  // format the value
  const options = {
    currency,
    style: 'currency',
  };
  return (value / 100).toLocaleString(locale, options);
}

function formatDateTime(value, locale, options) {
  return (new Date(value)).toLocaleString(locale, options);
}

function formatTransaction(config, transaction) {
  const locale = config.get('locale');
  const currency = config.get('currency');
  return {
    // TODO IBAN formatter
    ...transaction,
    amountF: formatCurrency(transaction.amount, locale, currency),
    bookingDateF: formatDateTime(transaction.bookingDate, locale),
    createdAtF: formatCurrency(transaction.createdAt, locale, currency),
    valutaDateF: formatDateTime(transaction.valutaDate, locale),
  };
}

export {
  formatCurrency,
  formatDateTime,
  formatTransaction,
};
