"use strict";
/*!
 * dns-server - lib/middleware/dns-cache.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const debug = require('debug')('dns-server:handler:save-to-cache');

module.exports = function (cache) {
  return function*(next) {
    debug(this.result);
    if (this.result) {

      let data = {
        answer: this.result.data,
        authority: [],
        additional: []
      };

      cache.store(data);
    }
    yield next;
  };
};