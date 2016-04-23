"use strict";
/*!
 * dns-server - test/test.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dnsAddr = '8.8.8.8';

const dnsAddrs = [
  '8.8.8.8',
  '8.8.4.4',
  //'223.5.5.5',
  //'223.6.6.6'
];

const mod = require('../');

const factory = mod.queryFactory;

describe('DnsQuery', function () {
  it('Query a DNS from ' + dnsAddr + ' should no error', function (done) {

    var should = require('should');
    var co = require('co');

    var query = factory(dnsAddr);
    var query_ = factory(query);

    should(query === query_).eql(true);

    co(function*() {
      let res = yield query.query('www.baidu.com', 'A');
      should(res).have.property('data');
      done();
    }).catch(function (e) {
      done(e);
    });
  });

  it('Query a DNS from group ' + JSON.stringify(dnsAddrs) + ' should no error', function (done) {

    var should = require('should');
    var co = require('co');

    var query = factory(dnsAddrs);
    var query_ = factory(query);

    should(query === query_).eql(true);

    co(function*() {
      console.log(query);
      let res = yield query.query('www.baidu.com', 'A');
      should(res).have.property('data');
      done();
    }).catch(function (e) {
      done(e);
    });
  });
});