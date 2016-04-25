"use strict";
/*!
 * dns-server - lib/server/http.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const Base = require('./base');
const http = require('http');
const https = require('https');

module.exports = class HTTP extends Base {

  constructor(handler) {
    super(handler);
  }

  config(config) {
    super.config(config);
    if (config.ssl === true) {
      this.server = https.createServer({
        key: config['ssl-key'],
        cert: config['ssl-cert']
      }, this.handler)
    } else {
      this.server = http.createServer(this.handler)
    }
    this.create();
  }
};
