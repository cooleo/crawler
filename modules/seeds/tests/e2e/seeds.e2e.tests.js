'use strict';

describe('Seeds E2E Tests:', function () {
  describe('Test Seeds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/seeds');
      expect(element.all(by.repeater('seed in seeds')).count()).toEqual(0);
    });
  });
});
