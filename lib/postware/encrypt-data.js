"use strict";
/*!
 * dns-server - lib/postware/encrypt-data.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const crypto = require('crypto');

module.exports = function (opts) {

  return function *(next) {

    // TODO complete crypto

    yield next;
  }
};