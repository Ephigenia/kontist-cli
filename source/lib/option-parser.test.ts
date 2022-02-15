import { expect } from 'chai';
import { InvalidOptionArgumentError } from 'commander';
import * as lib from './option-parser';

describe('parseIban', function () {
  const valid = [
    'GB94BARC10201530093459',
    'GB33BUKB20201555555555',
    // with spacing
    'GB33 BUKB 2020 1555 5555 55',
    'GB33BU KB 2020 1555555555',
  ];
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
      // invalid checks due to invalid bank codes, checksums etc.
      // taken from https://www.iban.com/testibans
      'GB94BARC20201530093459',
      'GB96BARC202015300934591',
      'GB12BARC20201530093A59',
      'GB78BARCO0201530093459',
      'GB2LABBY09012857201707',
      'GB01BARC20714583608387',
      'GB00HLFX11016111455365',
      'US64SVBKUS6S3300958879',
    ].forEach((input) => {
      it(`${JSON.stringify(input)}`, function () {
        expect(() => lib.parseIban(input as string)).to.throw(
          InvalidOptionArgumentError,
        );
      });
    });
  });
}); // parseIban

describe('assertValidSEPAChars', function () {
  it('is valid', function () {
    expect(lib.assertValidSEPAChars('Something with RN 2342/212-391')).to.equal(
      true,
    );
  });
  it('is invalid', function () {
    expect(() => lib.assertValidSEPAChars('ä')).to.throw(
      InvalidOptionArgumentError,
    );
  });
}); // assertValidSEPAChars

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
