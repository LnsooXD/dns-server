"use strict";
/*!
 * dns-server - test/test.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dnsAddr = '223.5.5.5';

describe('DNS Query', function () {
  it('Query a DNS from ' + dnsAddr + 'should no error', function (done) {

    var should = require('should');
    var co = require('co');
    var Query = require('../lib/query-dns');

    co(function*() {
      let query = new Query({address: dnsAddr, port: 53, type: 'udp', timeout: 1000});
      let res = yield query.query('www.baidu.com', 'A');
      should(res).have.property('data');
      done();
    });
  });
});