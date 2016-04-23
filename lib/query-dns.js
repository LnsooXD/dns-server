"use strict";
/*!
 * dns-server - lib/dns-source.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const dns = require('native-dns');
const is = require('is-type-of');
module.exports = class Query {

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
      let res = {
        len: 0,
        time: -1,
        data: []
      };

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
          answer.answer.forEach(function (a) {
            res.data.push(a);
          });
          res.len = res.data.length;
        }
      });

      req.on('end', function () {
        res.time = Date.now() - start;
        done(err, res);
      });

      req.send();
    }
  };
};

