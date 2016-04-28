"use strict";
/*!
 * dns-server - lib/middleware/adapt-result-for-dnsd.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const util = require('../util');
const clone = require('clone');
const consts = require('native-dns-packet').consts;
const QTN = consts.QTYPE_TO_NAME;
const NTQ = consts.NAME_TO_QTYPE;
const debug = require('debug')('dns-server:postwares:dnsd-adaptor');

module.exports = function *(next) {

  const body = this.body;
  const result = body.result;

  debug('before transform: ', result);

  if (result) {
    process(body.request, result);
  }

  debug('after transform: ', result);
  yield next;


};

function process(request, result) {
  let dst = [];
  let name = 'data';
  let list;
  if (result.hasOwnProperty(name) && (list = result[name])) {
    debug('process: data' + name + ': ', list);
    util.each(list, each);
    result[name] = dst;
  }

  function each(i, item) {
    dst.push(processItemResult(request, item));
  }
}

function processItemResult(request, item) {
  let qtype = item.type;
  let type = QTN[qtype] || request.type;
  qtype = NTQ[type];

  let data;
  switch (qtype) {
    case NTQ.A:
    case NTQ.AAAA:
      data = item.address;
      break;
    case NTQ.URL:
    case NTQ.CNAME:
    case NTQ.PTR:
      data = item.data || item.address;
      break;
    case NTQ.MX:
      data = [item.priority, item.exchange];
      break;
    case NTQ.SOA:
      data = {
        mname: item.primary,
        rname: item.admin,
        serial: item.serial,
        refresh: item.refresh,
        retry: item.retry,
        expire: item.expiration,
        ttl: item.minimum
      };
      break;
    default:
      data = item.address || item.data;
      break;
  }

 return {
    name: item.name,
    type: type,
    class: request.class,
    ttl: item.ttl,
    data: data
  };

}
