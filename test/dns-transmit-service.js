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
    method: 'GET'
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
  service1.use(saveToCache(cache));

  service1.post(transformResultFoDns);

  service1.start();
}

localTest();

// const crypto = require('crypto');


// var data = "156156165152165156156";
// console.log('Original cleartext: ' + data);
// var key = '78541561566';
// //var cipherEncoding = 'hex';
// //If the next line is uncommented, the final cleartext is wrong.
// var cipherEncoding = 'base64';
// const cipher = crypto.createCipher('aes192', key);
//
// var cipherChunks = [];
// cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
// cipherChunks.push(cipher.final('base64'));
// console.log(cipherEncoding + ' ciphertext: ' + cipherChunks.join(''));
//
// // var decipher = crypto.createDecipheriv(algorithm, key, iv);
// // var plainChunks = [];
// // for (var i = 0; i < cipherChunks.length; i++) {
// //   plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
// //
// // }
// // plainChunks.push(decipher.final(clearEncoding));
// // console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));
//

