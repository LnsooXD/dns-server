"use strict";
/*!
 * dns-server - lib/server/dns.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dnsd = require('hbo-dnsd');
const Base = require('./base');
const debug = require('debug')('dns-server:server:dns');

module.exports = class DNS extends Base {

  constructor(handler) {
    super(handler);
    this.server = dnsd.createServer(handler);
    this.create();
  }

  config(config) {
    super.config(config);
    if (config.zone) {
      let z = config.zone;
      debug('zone: ', z);
      // zone, server, admin, serial, refresh, retry, expire, ttl
      this.server.zone(z.zone, z.server, z.admin, z.serial,
        z.refresh, z.retry, z.expire, z.ttl);
    }
  }

};
