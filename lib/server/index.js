"use strict";
/*!
 * dns-server - lib/server/index.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const handlerFactory = require('../handler');
const http = require('./http');
const dns = require('./dns');

const SERVERS = {
  'GET': http,
  'POST': http,
  'DNS': dns
};

module.exports.createServer = function (self) {
  let handler = handlerFactory(self);
  return new (SERVERS[self.method])(handler);
};
