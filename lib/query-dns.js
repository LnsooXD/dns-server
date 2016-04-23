"use strict";
/*!
 * dns-server - lib/dns-source.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dns = require('native-dns');
const is = require('is-type-of');
const co = require('co');

class Query {

  constructor(opts) {
    this.server = {
      address: opts.address,
      port: opts.port,
      type: is.nullOrUndefined(opts.type) ? 'udp' : opts.type

    };
    this.timeout = is.nullOrUndefined(opts.timeout) ? 1000 : opts.timeout;
  }

  query(name, type) {
    return (done)=> {
      let err;
      let res = {};

      let question = dns.Question({
        name: name,
        type: type
      });
      let start = Date.now();

      let req = dns.Request({
        question: question,
        server: this.server,
        timeout: this.timeout
      });

      req.on('timeout', function () {
        err = new Error('Timeout in making request');
      });

      req.on('message', function (e, r) {
        err = e;
        res.data = r;
      });

      req.on('end', function () {
        res.time = Date.now() - start;
        done(err, res);
      });
    }
  };
}

module.exports = Query;

co(function*() {
  let query = new Query({address: '8.8.8.8', port: 53, type: 'udp', timeout: 1000});
  let res = yield query.query('www.baidu.com', 'A');
  console.log(res);
}).catch(function (e) {
  console.log(e);
  console.log(e.stack);
});


