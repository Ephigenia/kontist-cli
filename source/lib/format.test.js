import { expect } from 'chai';
import { formatCurrency } from './format.js';

describe('format', function() {
  describe('formatCurrency', function() {
    it('returns a german formatted currency value', function() {
      expect(formatCurrency(50_000, 'de-de', 'EUR')).to.equal('500,00 €');
    });
    it('uses the systems default locale', function() {
      process.env.LC_ALL = 'en-us';
      expect(formatCurrency(50_000, undefined, 'EUR')).to.equal('€500.00');
    });
    it('can use alternate currencies', function() {
      expect(formatCurrency(50_000, 'en-us', 'USD')).to.equal('$500.00');
    });
  });
}); // suite
