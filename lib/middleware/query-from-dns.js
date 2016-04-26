"use strict";
/*!
 * dns-server - lib/middleware/query-from-dns.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const util = require('./../util');
const factory = require('./../query-dns');

const debug = require('debug')('dns-server:middleware:query-dns');

module.exports = function (opts) {

  let query = factory(opts);

  return function *(next) {
    let request = this.request;
    let result = yield query.query(request.domain, request.type);
    let self = this;
    let len = 0;
    if (result) {
      copyToResult('answer');
      copyToResult('authority');
      copyToResult('additional');
      this.result.time = result.time;
    }

    this.result.len = len;

    function copyToResult(name) {
      let list;
      if (result.hasOwnProperty(name) && (list = result[name])) {
        util.each(list, function (i, v) {
          self.result.data.push(v);
          len++;
        })
      }
    }

    debug(this.result);
    this.error = 0;
    this.msg = 'success';
    yield next;
  }
};