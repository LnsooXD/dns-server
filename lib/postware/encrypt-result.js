"use strict";
/*!
 * dns-server - lib/postware/aes-encrypt-data.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const crypto = require('crypto');
const debug = require('debug')('dns-server:middleware:aes-encrypt');

module.exports = function (opts) {
  const method = opts.method || 'aes192';
  const key = opts.key;
  const charset = opts.charset || 'utf8';
  const encode = opts.encode || 'base64';
  return function *(next) {

    let data = JSON.stringify(this.body);
    const cipher = crypto.createCipher(method, key);
    var body = cipher.update(data, charset, encode);
    body += cipher.final(encode);
    this.body = body;

    yield next;
  }
};


