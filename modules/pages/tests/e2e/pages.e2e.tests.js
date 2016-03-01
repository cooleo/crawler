'use strict';

describe('Pages E2E Tests:', function () {
  describe('Test Pages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pages');
      expect(element.all(by.repeater('page in pages')).count()).toEqual(0);
    });
  });
});
