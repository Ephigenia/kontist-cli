import { InvalidArgumentError } from 'commander';

export function parseInt(value: string) {
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

export function parseDateAndTime(value: string) {
  // TODO before parsing values like "2" or "2020" make sure this is intended
  //      for creating transfers this might be not ok
  // SEE https://kontist.dev/sdk/#create-a-timed-order
  // TEST try different formats, example only shows 2017-03-30T12:56:54+00:00
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    throw new InvalidArgumentError('unable to parse date');
  }
  return new Date(timestamp);
}
