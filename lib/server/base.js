"use strict";
/*!
 * dns-server - lib/server/dns.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const util = require('../util');
const is = require('is-type-of');
const not = require('not-type-of');

module.exports = class Base {

  constructor(handler) {
    this.handler = handler;
    this.events = {};
    this.created = false;
  }

  on(event, fn) {
    if (this.created === true) {
      this.server.on(event, fn);
    } else {
      this.events[event] = fn;
    }
  }

  config(config) {
    this.config = config;
  }

  zone(z) {
    let server = this.server;
    if (not.nullOrUndefined(server) && is.function(server.zone)) {
      server.zone(z.zone, z.server, z.admin, z.serial,
        z.refresh, z.retry, z.expire, z.ttl);
    }
  }

  create() {
    this.created = true;
    util.each(this.events, function (event, fn) {
      this.server.on(event, fn);
    });
  }

  listen(port, host) {
    if (is.nullOrUndefined(host)) {
      this.server.listen(port);
    } else {
      this.server.listen(port, host);
    }
  }

  close() {
    this.server.close();
  }
};