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
const dnsCache = require('native-dns-cache');

const DnsTransmitService = mod.DnsTransmitService;
const queryDirectMiddleware = mod.getInternalMiddleware('query-from-dns');
const queryFromTransmit = mod.getInternalMiddleware('query-from-transmit-service');
const jsonResultPostware = mod.getInternalPostware('json-result');
const transformResultFoDns = mod.getInternalPostware('adapt-result-for-dnsd');
const queryFromCache = mod.getInternalMiddleware('query-from-dns-cache');
const saveToCache = mod.getInternalMiddleware('save-to-dns-cache');

function localTest() {
  const service = new DnsTransmitService({
    port: 3053,
    host: '127.0.0.1',
    method: 'GET',
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

  service.use(queryDirectMiddleware(dnsAddrs));
  service.post(jsonResultPostware);
  service.start();

  const service1 = new DnsTransmitService({
    port: 5354,
    host: '127.0.0.1',
    method: 'DNS',
    zones: [{
      zone: 'lnsoo.com',
      server: 'ns.lnsoo.con',
      admin: 'LnsooXD@gmail.com',
      serial: 'now',
      refresh: '2h',
      retry: '30m',
      expire: '2w',
      ttl: '10m'
    }]
  });

  let cache = new dnsCache({
    zone: 'lnsoo.com'
  });

  // service1.use(queryFromCache(cache));
  service1.use(queryFromTransmit(service));
  // service1.use(saveToCache(cache));

  service1.post(transformResultFoDns);

  service1.start();
}

// localTest();
