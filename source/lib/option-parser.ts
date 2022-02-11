import { InvalidArgumentError } from 'commander';

export function parseDateAndTime(value: string) {
  if (!/^20\d\d-\d\d-\d\d$/.test(value)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  return new Date(timestamp);
}

export function parseIban(str: string) {
  return str;
}

export function parseAmount(str: string) {
  if (!/^\d+$/.test(str)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  return +str;
}
