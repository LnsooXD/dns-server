"use strict";
/*!
 * dns-server - lib/dns-transmit-server.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

const http = require('http');
const co = require('co');
const compose = require('koa-compose');
const debug = require('debug')('dns-server:transmit');
const is = require('is-type-of');
const EventEmitter = require('events').EventEmitter;
const util = require('./util');
const dnsd = require('hbo-dnsd');
const serverFactory = require('./server');


const COMMON_OPTS_KEY = ['port', 'host', 'method'];

module.exports = class DnsTransmitService extends EventEmitter {

  constructor(opts) {
    super();

    this.port = util.normalizePort(opts.port) || 5353;
    this.host = opts.host || 'localhost';
    this.method = (opts.method || 'GET').toUpperCase();

    let config = {};

    util.each(opts, function (k, v) {
      config[k] = v;
    }, function (k) {
      return COMMON_OPTS_KEY.indexOf(k) < 0;
    });

    this.config = config;

    this.middlewares = [];
    this.postwares = [];
  }

  zone(zone) {
    this.server.zone(zone);
  }

  start() {
    this.server = serverFactory.createServer(this);
    this.server.config(this.config);

    this.on('error', createErrorHandler(this));
    this.server.on('error', createErrorHandler(this));
    this.server.on('listening', createListener(this));

    this.server.listen(this.port, this.host);
  }

  checkMethod(req) {
    var method = req.method.toUpperCase();
    return this.method == method;
  }

  stop() {
    this.server.close();
    delete this.server;
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  post(postware) {
    this.postwares.push(postware);
    return this;
  }

  runWares(ctx, types, done) {

    let self = this;
    let wares = [];
    let tmp;
    types = types.split('&');
    util.each(types, function (i, type) {
      if (self.hasOwnProperty(type)) {
        tmp = self[type.trim()];
        if (is.array(tmp)) {
          wares = wares.concat(tmp);
        }
      }
    });

    debug(wares);

    var fn = co.wrap(compose(wares));
    fn.call(ctx).then(function () {
      done(false);
    }).catch(function (e) {
      done(e);
    });
  }
};

function createErrorHandler(ctx) {
  return function (error) {
    console.log(error.stack || error);
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof ctx.port === 'string'
      ? 'Pipe ' + ctx.port
      : 'Port ' + ctx.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }.bind(ctx);
}

function createListener(ctx) {
  return function () {
    debug('Listening on ' + this.host + ":" + this.port);
  }.bind(ctx);
}
