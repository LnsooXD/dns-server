"use strict";
/*!
 * dns-server - lib/demo.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const co = require('co');

function *gen0(next) {
  console.log('gen0: ', next);
  yield next;
}

function *gen1(next) {
  console.log('gen1: ', next);
  yield next();
}


function *gen2(next) {
  console.log('gen2: ', next);
  yield next;
}


function *gen3(next) {
  console.log('gen3: ', next);
  yield next;
}

var middleware = [gen0, gen1, gen2, gen3];

// co.wrap(compose(middleware))().then(function () {
//   console.log('complete~~');
// }).catch(function (e) {
//   console.log(e);
// });


new Promise(function (resolve, reject) {
  console.log('Run Promise');
  reject(new Error('Promise Error'));
}).catch(function (e) {
  console.log(e);
  throw e;
});


// co(compose(middleware)).catch(function (e) {
//   console.log(e);
//   setTimeout(function () {
//     throw e;
//   }, 1);
//
// });

function compose(middleware) {
  return function *(next) {
    if (!next) next = noop();

    var i = middleware.length;

    while (i--) {
      next = middleware[i].call(this, next);
    }

    return yield *next;
  }
}

/**
 * Noop.
 *
 * @api private
 */

function *noop() {
}




