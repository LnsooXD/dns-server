"use strict";
/*!
 * dns-server - handler/index.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */
module.exports = function handlerFactory(self) {
  let method = self.method;
  if (method == 'index') {
    unsupportedMethod(method);
  }
  try {
    let creator = require('./' + method.toLowerCase());
    return creator(self);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      unsupportedMethod(method);
    } else {
      throw e;
    }
  }
};

function unsupportedMethod(method) {
  let err = new Error('Unsupported method: ' + method);
  err.code = 'UNSUPPORTED_SERVER_METHOD';
  throw err;
}
