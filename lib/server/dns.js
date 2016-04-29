"use strict";
/*!
 * dns-server - lib/server/dns.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dnsd = require('hbo-dnsd');
const it = require('ctrl-it');
const is = require('is-type-of');
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
    let zs = is.array(config.zones) ? config.zones : [];

    if (config.zone) {
      zs.push(config.zone);
    }

    it.each(zs, function (i, zone) {
      debug('add zone: ', zone);
      this.zone(zone);
    }.bind(this));
  }

};
