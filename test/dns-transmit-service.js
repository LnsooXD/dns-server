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
const saveToCache = mod.getInternalPostware('save-to-dns-cache');
const aesCipher = mod.getInternalPostware('encrypt-result');

function localTest() {

  const cipherOpts = {
    method: 'aes192',
    key: 'fh,gopfdsmkhk[oldnh[mf[dsgfdsahgrbndhfdshikuty5464',
    charset: 'utf8',
    encode: 'base64'
  };

  const serviceOpts = {
    port: 3053,
    host: '127.0.0.1',
    method: 'GET',
    requestEncode: 'hex'
  };

  const service = new DnsTransmitService(serviceOpts);

  service.use(queryDirectMiddleware(dnsAddrs));
  service.post(aesCipher(cipherOpts));
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

  serviceOpts.cipher = cipherOpts;

  service1.use(queryFromCache(cache));
  service1.use(queryFromTransmit(serviceOpts));

  service1.post(saveToCache(cache));
  service1.post(transformResultFoDns);

  service1.start();
}

// localTest();