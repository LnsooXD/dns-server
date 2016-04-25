"use strict";
/*!
 * dns-server - lib/util.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const mod = module.exports;

const CTRL_NORMAL = 100;
const CTRL_CONTINUE = 101;
const CTRL_BREAK = 102;

mod.CTRL_NORMAL = CTRL_NORMAL;
mod.CTRL_CONTINUE = CTRL_CONTINUE;
mod.CTRL_BREAK = CTRL_BREAK;

mod.normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

mod.each = function each(obj, eachCb) {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      let res = eachCb(k, obj[k]);
      if (res === CTRL_BREAK) {
        break;
      }
    }
  }
};

mod.every = function* every(obj, eachCb) {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      let res = yield eachCb(k, obj[k]);
      if (res === CTRL_BREAK) {
        break;
      }
    }
  }
};