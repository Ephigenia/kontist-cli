import { expect } from 'chai';
import { formatCurrency, formatDateTime } from './format';

describe('formatCurrency', function () {
  it('returns the number formateted with the given locale', function () {
    expect(formatCurrency(23198, 'DE-de', 'EUR')).to.equal('231,98 €');
  });
}); // formatCurrency

describe('formatDateTime', function () {
  it('formats Dates', function () {
    const date = new Date('2022-02-27T17:27:30.131Z');
    expect(formatDateTime(date, 'DE-de')).to.equal('27.2.2022, 18:27:30');
  });
  it('formats timestamps', function () {
    const date = new Date(1238112322371);
    expect(formatDateTime(date, 'DE-de')).to.equal('27.3.2009, 01:05:22');
  });
  it('formats string parsable dates', function () {
    expect(formatDateTime('2022-02-27T17:27:30.131Z', 'DE-de')).to.equal(
      '27.2.2022, 18:27:30',
    );
  });
  it('returns the number formateted with the given locale', function () {
    const date = new Date('2022-02-27T17:27:30.131Z');
    expect(formatDateTime(date, 'DE-de')).to.equal('27.2.2022, 18:27:30');
  });
  it('returns Invalid Date', function () {
    expect(formatDateTime('lorem ipsum', 'DE-de')).to.equal('Invalid Date');
  });
}); // formatCurrency
