import { InvalidArgumentError } from 'commander';

export function parseDateAndTime(value: string) : Date {
  if (!/^20\d\d-\d\d-\d\d$/.test(value)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  return new Date(timestamp);
}

export function parseIban(str: unknown) {
  const regexp = /^[A-Z]{2}[0-9]{2}\d+$/;
  if (!regexp.test(String(str))) {
    throw new InvalidArgumentError('unable to parse iban');
  }
  return str;
}

export function parseAmount(str: unknown) : number {
  if (!/^\d+$/.test(String(str))) {
    throw new InvalidArgumentError('unable to parse amount');
  }
  return +str;
}
