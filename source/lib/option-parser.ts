import { validateIBAN, electronicFormatIBAN } from 'ibantools';
import { InvalidArgumentError } from 'commander';

export function assertValidIban(iban: string): void {
  const result = validateIBAN(iban);
  if (!result.valid) {
    throw new InvalidArgumentError(
      `The given IBAN ${JSON.stringify(
        iban,
      )} is not valid, error codes: ${result.errorCodes.join(', ')}`,
    );
  }
  return;
}

export function assertValidSEPAChars(str: string): boolean {
  // according to https://www.sepaforcorporates.com/sepa-implementation/valid-xml-characters-sepa-payments/
  if (!/^[a-z0-9 /\-\?:().,‘+]+$/i.test(String(str))) {
    throw new InvalidArgumentError(
      `The given string ${JSON.stringify(
        str,
      )} contains invalid non-SEPA standard character(s).`,
    );
  }
  return true;
}

export function parseAmount(str: unknown): number {
  if (!/^\d+$/.test(String(str))) {
    throw new InvalidArgumentError(
      'The given amount is not valid. Please enter the amount in cents.',
    );
  }
  return +(str as string);
}

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

export function parseIban(str: string): string {
  const iban = electronicFormatIBAN(str);
  if (!iban) {
    throw new InvalidArgumentError(
      `The given IBAN ${JSON.stringify(iban)} is not valid.`,
    );
  }
  assertValidIban(iban);
  return iban;
}

export function sanitizeSEPAChars(str: string): string {
  // conveniently replace some german umlauts to their
  [
    ['ß', 'ss'],
    ['ä', 'ae'],
    ['ö', 'oe'],
    ['ü', 'ue'],
    ['Ä', 'Ae'],
    ['Ö', 'Oe'],
    ['Ü', 'Ue'],
  ].forEach(([a, b]) => {
    str = String(str).replace(new RegExp(a, 'g'), b);
  });
  return str;
}
