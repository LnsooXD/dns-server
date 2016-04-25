"use strict";
/*!
 * dns-server - test/test.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const dnsAddrs = [
  // '8.8.8.8',
  // '8.8.4.4',
  '223.5.5.5',
  '223.6.6.6'
];

const mod = require('../');
const DnsTransmitService = mod.DnsTransmitService;
const queryDirectMiddleware = mod.getInternalMiddleware('query-from-dns');
const queryFromTransmit = mod.getInternalMiddleware('query-from-transmit-service');
const jsonResultPostware = mod.getInternalPostware('json-result');
const transformResultFoDns = mod.getInternalMiddleware('adapt-result-for-dnsd');

function testInLocal() {
  const service = new DnsTransmitService({
    port: 3053,
    host: '127.0.0.1',
    method: 'GET'
  });

  service.use(queryDirectMiddleware(dnsAddrs));
  service.post(jsonResultPostware);
  service.start();

  const service1 = new DnsTransmitService({
    port: 53,
    host: '127.0.0.1',
    method: 'DNS',
    zone: {
      zone: 'lnsoo.com',
      server: 'ns.lnsoo.con',
      admin: 'LnsooXD@gmail.com',
      serial: 'now',
      refresh: '2h',
      retry: '30m',
      expire: '2w',
      ttl: '10m'
    }
  });

  service1.use(queryFromTransmit(service));
  service1.use(transformResultFoDns);
  service1.start();
}

testInLocal();
