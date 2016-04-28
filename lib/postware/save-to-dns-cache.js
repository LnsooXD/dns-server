"use strict";
/*!
 * dns-server - lib/middleware/dns-cache.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const debug = require('debug')('dns-server:postware:save-to-cache');

module.exports = function (cache) {
  return function*(next) {

    const body = this.body;
    const result = body.result;

    debug(result);
    if (result) {
      let data = {
        answer: result.data,
        authority: [],
        additional: []
      };

      cache.store(data);
    }
    yield next;
  };
};