"use strict";
/*!
 * dns-server - lib/postware/json-result.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

module.exports = function *(next) {
  this.body = JSON.stringify(this.body);
  this.headers = {
    'Content-Length': Buffer.byteLength(this.body),
    'Content-Type': 'text/json'
  };
  yield next;
};