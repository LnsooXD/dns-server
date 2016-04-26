"use strict";
/*!
 * dns-server - lib/middleware/query-from-transmit-service.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const http = require('http');
const crypto = require('crypto');
const util = require('../util');
const clone = require('clone');
const debug = require('debug')('dns-server:middleware:query-from-transmit');

module.exports = function (opts) {

  const options = {
    hostname: opts.host,
    port: util.normalizePort(opts.port) || 3053,
    path: '',
    method: opts.method
  };

  const encode = opts.requestEncode;

  if (opts.cipher) {
    let cipher = opts.cipher;
    options.cipher = {
      method: cipher.method || 'aes192',
      key: cipher.key,
      charset: cipher.charset || 'utf8',
      encode: cipher.encode || 'base64'
    }
  }

  return function *(next) {
    let request = this.request;
    let opts = clone(options);
    opts.path = '@' + request.type + ':' + request.domain;
    if (encode) {
      opts.path = new Buffer(opts.path).toString(encode);
    }
    opts.path = '/' + opts.path;
    this.result = (yield requestServer(opts)).result;
    this.error = 0;
    this.msg = 'success';
    yield next;
  }
};

function requestServer(options) {
  return function (done) {
    var request = http.request(options, function (res) {
      res.setEncoding('utf8');

      let body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        try {
          if (options.cipher) {
            let cipher = options.cipher;
            const decipher = crypto.createDecipher(cipher.method, cipher.key);
            let res = decipher.update(body, cipher.encode, cipher.charset);
            body = res + decipher.final(cipher.charset);
          }
          done(null, JSON.parse(body));
        } catch (e) {
          done(e);
        }
      })
    });
    request.on('error', function (e) {
      done(e);
    });
    request.end();
  }
}