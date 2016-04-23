"use strict";
/*!
 * dns-server - test/test.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const dnsAddrs = [
  '8.8.8.8',
  '8.8.4.4',
  //'223.5.5.5',
  //'223.6.6.6'
];

const mod = require('../');
const DnsTransmitService = mod.DnsTransmitService;
const quertDirectMiddleware = mod.getInternalMiddleware('query-from-dns');
const jsonResultPostware = mod.getInternalPostware('json-result');

function testInLocal() {
  const service = new DnsTransmitService({
    port: 3053,
    host: '127.0.0.1',
    method: 'GET'
  });

  service.use(quertDirectMiddleware(dnsAddrs));
  service.post(jsonResultPostware);
  service.start();
}

// testInLocal();
