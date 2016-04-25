"use strict";
/*!
 * dns-server - lib/dns-source.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dns = require('native-dns');
const is = require('is-type-of');
const util = require('./util');
const not = require('not-type-of');

module.exports = function factory(opts) {

  if (opts instanceof DnsQueryBase) {
    return opts;
  }

  if (is.array(opts)) {
    let len = opts.length;
    if (len <= 0) {
      return null;
    }
    if (len == 1) {
      return new DnsQuery(opts[0]);
    } else {
      return new QueryDnsGroup(opts);
    }
  } else {
    return new DnsQuery(opts);
  }
};

class DnsQueryBase {
}

class DnsQuery extends DnsQueryBase {

  constructor(opts) {
    super();
    if (is.string(opts)) {
      opts = {
        address: opts,
        port: 53,
        type: 'udp'
      }
    }

    this.server = {
      address: opts.address,
      port: util.normalizePort(opts.port) || 53,
      type: is.nullOrUndefined(opts.type) ? 'udp' : opts.type

    };
    this.timeout = is.nullOrUndefined(opts.timeout) ? 1000 : opts.timeout;
  }

  query(name, type) {
    return function (done) {
      let err;
      let res = {
        len: 0,
        time: -1,
        dns: this.server.address,
        data: []
      };

      type = type.toUpperCase();

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

      req.on('message', function (e, answer) {
        err = e;
        if (!e) {
          res.data = answer.answer;
          res.len = res.data.length;
        }
      });

      req.on('end', function () {
        res.time = Date.now() - start;
        done(err, res);
      });

      req.send();
    }.bind(this);
  };
}

class QueryDnsGroup extends DnsQueryBase {

  constructor(opts) {
    super();
    let querys = [];
    let i = opts.length;
    while (i--) {
      querys.push(new DnsQuery(opts[i]));
    }
    this.querys = querys;
  }

  *query(name, type) {
    let query = getOneQuery(this.querys);
    return yield query.query(name, type);
  }
}

function getOneQuery(querys) {
  let len = querys.length;
  let index = Math.floor(Math.random() * len);
  if (index >= len) {
    index--;
  }
  return querys[index];
}


