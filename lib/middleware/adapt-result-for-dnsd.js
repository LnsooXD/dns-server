"use strict";
/*!
 * dns-server - lib/middleware/adapt-result-for-dnsd.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
const util = require('../util');
const consts = require('native-dns-packet').consts;
const QTN = consts.QTYPE_TO_NAME;
const NTQ = consts.NAME_TO_QTYPE;
const debug = require('debug')('dns-server:middleware:dnsd-adaptor');

module.exports = function *(next) {

  const request = this.request;
  const result = this.result;

  debug('before transform: ', result);

  let src = result.data;
  let dst = [];
  util.each(src, function (i, item) {
    dst.push(processItemResult(request, item));
  });
  result.data = dst;

  debug('after transform: ', result);
  yield next;
};

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
