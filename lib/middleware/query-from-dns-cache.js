"use strict";
/*!
 * dns-server - lib/middleware/query-from-dns-cache.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const not = require('not-type-of');
const dns = require('native-dns');
const debug = require('debug')('dns-server:middleware:query-cache');

module.exports = function (cache) {
  const lookup = thunkCache(cache);
  return function*(next) {
    let request = this.request;
    let self = this;

    let question = dns.Question({
      name: request.domain,
      type: request.type
    });

    let result = yield lookup(question);

    debug('result: ', result);
    if (result) {
      self.result.data = result;
      self.result.len = result.length;
    } else {
      yield next;
    }
  }
};

function thunkCache(cache) {
  return function (question) {
    return function (done) {
      cache.lookup(question, function (results) {
        done(null, results);
      });
    };
  };
}


