"use strict";
/*!
 * dns-server - lib/middleware/query-from-dns.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const factory = require('./../query-dns');

module.exports = function (opts) {

  let query = factory(opts);

  return function *(next) {
    let request = this.request;
    this.result = yield query.query(request.domain, request.type);
    this.error = 0;
    this.msg = 'success';
    yield next;
  }
};