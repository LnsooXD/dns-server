"use strict";
/*!
 * dns-server - handler/dns.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const util = require('../util');
const debug = require('debug')('dns-server:handler:dns');

module.exports = function createDnsHandler(self) {
  return function handler(req, res) {
    let question = req.question[0];
    let body = {
      error: 1,
      msg: 'unknown error',
      result: {
        data: [],
        time: -1,
        len: 0
      },
      request: 'unknown'
    };

    body.request = {
      class: question.class,
      type: question.type,
      domain: question.name
    };

    self.runWares(body, 'middlewares', function (e) {
      if (e === false) {

        let ctx = {
          body: body
        };

        self.runWares(ctx, 'postwares', function (e) {
          if (e === false) {
            util.each(body.result.data, function (k, item) {
              debug('push:', item);
              res.answer.push(item);
            });
          } else {
            self.emit('error', e);
          }

          res.end();
        });

      } else {
        self.emit('error', e);
        res.end();
      }

    });
  }
};