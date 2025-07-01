const { getVoicesData } = require('../utils/i18nVoices');

describe('getVoicesData', () => {
  it('should wrap all strings in t()', () => {
    const t = jest.fn(x => x + '_t');
    const data = getVoicesData(t);
    expect(data[0].language.endsWith('_t')).toBe(true);
  });
});
