const assert = require('assert');

const isRequestAjaxOrApi = require('../utils/isRequestAjaxOrApi');

describe('utils - isRequestAjaxOrApi', function () {
  describe('when req accepts html and is not an XMLHttpRequest', function () {
    it('should return false', function () {
      const req = {
        accepts: () => true, // accept html
        xhr: false
      }

      const result = isRequestAjaxOrApi(req)
      const expected = false;

      assert.strictEqual(result, expected);
    })
  })

  describe('when req does not accepts html and is not an XMLHttpRequest', function () {
    it('should return false', function () {
      const req = {
        accepts: () => false, // not accept html
        xhr: false
      }

      const result = isRequestAjaxOrApi(req)
      const expected = true;

      assert.strictEqual(result, expected);
    })
  })

  describe('when req accepts html and is an XMLHttpRequest', function () {
    it('should return false', function () {
      const req = {
        accepts: () => true, // not accept html
        xhr: true
      }

      const result = isRequestAjaxOrApi(req)
      const expected = true;

      assert.strictEqual(result, expected);
    })
  })
})