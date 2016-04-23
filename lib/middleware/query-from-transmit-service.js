"use strict";
/*!
 * dns-server - lib/middleware/query-from-transmit-service.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const http = require('http');
const util = require('../util');
const clone = require('clone');

module.exports = function (opts) {

  const options = {
    hostname: opts.host,
    port: util.normalizePort(opts.port) || 3053,
    path: '',
    method: opts.method
  };

  return function *(next) {
    let request = this.request;
    let opts = clone(options);
    opts.path = '/@' + request.type + ':' + request.domain;
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