import { expect } from 'chai';
import { InvalidOptionArgumentError } from 'commander';
import * as lib from './option-parser';

describe('parseIban', function () {
  const valid = ['DE86701500000094203609', 'DE867015000000942'];
  valid.forEach((iban) => {
    it(`valid ${iban}`, function () {
      expect(lib.parseIban(iban)).to.be.a('String');
    });
  });

  describe('invalid', function () {
    [
      1,
      '1',
      'DE12',
      'DE',
      'DE86 7015 0000 0094 2036 09',
      ' DE86701500000094203609',
    ].forEach((input) => {
      it(`${JSON.stringify(input)}`, function () {
        expect(() => lib.parseIban(input)).to.throw(InvalidOptionArgumentError);
      });
    });
  });
}); // parseIban

describe('assertValidSEPAChars', function () {
  it('is valid', function () {
    expect(lib.assertValidSEPAChars('Undertaker')).to.equal(true);
  });
});

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
}); // parseDateAndTime

describe('parseAmount', function () {
  const valid = [
    ['1', 1],
    ['0', 0],
    ['12381', 12381],
    ['109', 109],
  ];
  valid.forEach(([input, result]) => {
    it(`${JSON.stringify(input)} to ${JSON.stringify(result)}`, function () {
      expect(lib.parseAmount(input)).to.equal(result);
    });
  });

  const invalid = ['-1', false, {}, ' 1', ' 1 ', '1 ', '2.1', '2.', '2.3'];
  invalid.forEach((value) => {
    it(`doesn’t accept ${JSON.stringify(value)}`, function () {
      expect(() => lib.parseAmount(value)).to.throw(InvalidOptionArgumentError);
    });
  });
}); // parseAmount
