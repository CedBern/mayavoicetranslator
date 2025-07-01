const { logEvent } = require('../services/logger');

describe('logEvent', () => {
  it('should log a structured event', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logEvent({ type: 'info', plugin: 'test', message: 'Hello', data: { foo: 1 }, userId: 'u', locale: 'fr' });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('"type":"info"'));
    spy.mockRestore();
  });
});
