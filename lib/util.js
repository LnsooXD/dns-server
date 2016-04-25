"use strict";
/*!
 * dns-server - lib/util.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const not = require('not-type-of');
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

mod.each = function each(obj, eachCb, filter) {
  filter = eachFilter(filter);
  let v;
  let res;
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      v = obj[k];
      if (filter(k, v)) {
        res = eachCb(k, v);
        if (res === CTRL_BREAK) {
          break;
        }
      }
    }
  }
};

mod.every = function* every(obj, eachCb, filter) {
  filter = everyFilter(filter);
  let v;
  let res;
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      v = obj[k];
      if (yield filter(k, v)) {
        res = yield eachCb(k, v);
        if (res === CTRL_BREAK) {
          break;
        }
      }
    }
  }
};

function eachFilter(filter) {
  return function (k, v) {
    return not.function(filter) || filter(k, v);
  }
}

function everyFilter(filter) {
  return function *(k, v) {
    return not.generator(filter) || yield filter(k, v);
  }
}