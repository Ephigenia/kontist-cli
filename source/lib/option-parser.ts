import { InvalidArgumentError } from 'commander';

export function parseDateAndTime(value: string): Date {
  if (!/^20\d\d-\d\d-\d\d$/.test(value)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  return new Date(timestamp);
}

export function parseIban(str: unknown): string {
  const iban = String(str);
  if (!/^[A-Z]{2}[0-9]{2}\d+$/.test(iban)) {
    throw new InvalidArgumentError('The given IBAN doesn’t have a valid format.');
  }
  return iban;
}

export function parseAmount(str: unknown): number {
  if (!/^\d+$/.test(String(str))) {
    throw new InvalidArgumentError('The given amount is not valid. Please enter the amount in cents.');
  }
  return +(str as string);
}
