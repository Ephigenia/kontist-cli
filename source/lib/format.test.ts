import { expect } from 'chai';
import { formatCurrency } from './format';

describe('format', function () {
  it('returns the number formateted with the given locale', function () {
    expect(formatCurrency(23198, 'DE-de', 'EUR')).to.equal('231,98 €');
  });
});
