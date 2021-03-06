/*
  Copyright Jesús Rubio <jesusprubio@gmail.com>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

/* eslint-disable no-console */

'use strict';

const assert = require('assert');

const client = require('../..');
const utilsTest = require('../utils');

let shodanKey;
if (process.env.KEY_TEST) {
  shodanKey = process.env.KEY_TEST;
}

describe('searchTokens', () => {
  it('should fail if "query" parameter no present', async () =>
    utilsTest.throwsAsync(
      () => client.searchTokens(),
      /Required parameter: query/,
    ));

  it('should fail if "key" parameter no present', async () =>
    utilsTest.throwsAsync(
      () => client.searchTokens('asterisk port:5060'),
      /You must provide a valid API key/,
    ));

  it('should fail if the HTTP request fails', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.searchTokens('asterisk port:5060', 'a'),
      /request.get : 40/,
    );
  });

  it('should have into account the "timeout" option', async function t() {
    utilsTest.insist(this);
    utilsTest.throwsAsync(
      () => client.searchTokens('asterisk port:5060', 'a', { timeout: 1 }),
      /request.get : Error: ETIMEDOUT/,
    );
  });

  it('should work for a valid query', async function t() {
    if (!shodanKey) {
      this.skip();
    }
    utilsTest.insist(this);

    const res = await client.searchTokens('asterisk port:5060', shodanKey);

    assert.deepEqual(res, {
      attributes: { ports: [5060] },
      errors: [],
      string: 'asterisk',
      filters: ['port'],
    });
  });
});
