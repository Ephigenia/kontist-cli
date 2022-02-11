import { expect } from 'chai';
import { InvalidOptionArgumentError } from 'commander';
import * as lib from './option-parser';

describe('parseDateAndTime', function () {
  const valid = [
    ['2022-01-01', '2022-01-01T00:00:00.000Z'],
    ['2022-02-29', '2022-03-01T00:00:00.000Z'],
  ];
  valid.forEach(([input, result]) => {
    it(`Accepts ${JSON.stringify(input)} to ${JSON.stringify(
      result,
    )}`, function () {
      const f = lib.parseDateAndTime(input);
      expect(f.toISOString()).to.equal(result);
    });
  });

  const invalid = [
    '2022',
    false,
    '2022-1-01',
    '2022-01-1',
    '1999-01-01',
    null,
    {},
    2,
    2093,
  ];
  invalid.forEach((input) => {
    it(`doesn’t accept ${JSON.stringify(input)}`, function () {
      expect(() => lib.parseDateAndTime(input as string)).to.throw(
        InvalidOptionArgumentError,
      );
    });
  });
}); // suite

describe('parseAmount', function () {
  it('doesnt accept it', function () {
    const f = lib.parseAmount('12381');
    expect(f).to.equal(12381);
  });
});
