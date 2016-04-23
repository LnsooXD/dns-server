"use strict";
/*!
 * dns-server - index.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const mod = module.exports;

mod.queryFactory = require('./lib/query-dns');
mod.DnsTransmitService = require('./lib/dns-transmit-service');

mod.getInternalMiddleware = function (name) {
  return require('./lib/middleware/' + name);
};

mod.getInternalPostware = function (name) {
  return require('./lib/postware/' + name);
};



