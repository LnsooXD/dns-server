"use strict";
/*!
 * dns-server - lib/middleware/query-from-dns-cache.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const not = require('not-type-of');
const notNullOrUndefined = not.nullOrUndefined;

module.exports = function (opts) {
  const cache = opts.cache;
  return function*(next) {
    let request = this.request;
    let result = yield cache.get('@' + request.type + ':' + request.domain);
    if (notNullOrUndefined(result)) {

    }
    // this.error = 0;
    // this.msg = 'success';
    yield next;
  }
};


