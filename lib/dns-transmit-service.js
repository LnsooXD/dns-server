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

module.exports = class DnsTransmitService extends EventEmitter {

  constructor(opts) {
    super();
    this.port = util.normalizePort(opts.port);
    this.host = opts.host;
    this.method = opts.method || 'GET';
    this.middlewares = [];
    this.postwares = [];
    // this.events = new EventEmitter();
  }

  start() {
    this.server = http.createServer(createLoop(this));
    this.on('error', createErrorHandler(this));
    this.server.on('error', createErrorHandler(this));
    this.server.on('listening', createListener(this));

    if (is.nullOrUndefined(this.host)) {
      this.server.listen(this.port);
    } else {
      this.server.listen(this.port, this.host);
    }
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
};

function checkMethod(req) {
  var method = req.method.toUpperCase();
  return this.method == method;
}

function parseDomainAndType(req) {
  let uri = decodeURIComponent(req.url);
  console.log(uri);
  if (/^\/@(\w+)\:([0-9a-zA-Z\.\-\u4E00-\u9FA5\uF900-\uFA2D]+)/i.test(uri)) {
    return {
      type: RegExp.$1.toUpperCase(),
      domain: RegExp.$2
    }
  } else {
    return false;
  }
}

function send(self, body, res) {
  let ctx = {
    body: body,
    headers: {}
  };

  combileAndRun(ctx, self.postwares, function (e) {
    if (e === false) {
      res.writeHead(200, ctx.headers);
      res.end(ctx.body);
    } else {
      body = 'Service Internal Error: ' + e;
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'text/plain'
      });
      res.end(body);
    }
  });
}


function createErrorHandler(ctx) {
  return function (error) {
    console.log(error.stack || error);
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

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
    var addr = this.server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }.bind(ctx);
}


function createLoop(self) {
  return function (req, res) {
    var body = {
      error: 1,
      msg: 'unknown error',
      result: [],
      request: 'unknown'
    };

    if (!checkMethod.call(self, req)) {
      body.error = 100;
      body.msg = 'Unsupported Method: ' + self.method;
      send(self, body, res);
    } else {
      let reqData = parseDomainAndType(req);
      if (!reqData) {
        body.error = 101;
        body.msg = 'Domain Parse Error';
        send(self, body, res);
      } else {
        body.request = reqData;
        combileAndRun(body, self.middlewares, function (e) {
          if (e === false) {
            send(self, body, res);
          } else {
            body.error = 102;
            body.msg = 'Server Internal Error: ' + e;
            send(self, body, res);
            self.emit('error', e);
          }
        });
      }
    }
  };
}

function combileAndRun(ctx, waresArray, done) {
  var fn = co.wrap(compose(waresArray));
  fn.call(ctx).then(function () {
    done(false);
  }).catch(function (e) {
    done(e);
  });
}