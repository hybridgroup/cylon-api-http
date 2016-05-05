/*
 * Cylon API
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint no-sync: 0 */

"use strict";

var fs = require("fs"),
    path = require("path");

var express = require("express"),
    bodyParser = require("body-parser"),
    _ = require("lodash");

var defaults = {
  host: "127.0.0.1",
  port: "3000",
  auth: false,
  CORS: "",
  serveDir: path.join(__dirname, "/../node_modules/robeaux/"),
  ssl: {
    key: path.join(__dirname, "/../ssl/server.key"),
    cert: path.join(__dirname, "/../ssl/server.crt")
  }
};

// handle the flattened location for dependencies using npm 3.x
if (!fs.existsSync(defaults.serveDir)) {
  defaults.serveDir = path.join(__dirname, "/../../robeaux");
}

var API = module.exports = function API(opts) {
  opts = opts || {};

  this.mcp = opts.mcp;

  _.forEach(defaults, function(def, name) {
    this[name] = _.has(opts, name) ? opts[name] : def;
  }, this);

  this.createServer();
  this.configureMiddleware();
  this.loadRoutes();

  // error handling
  this.express.use(function(err, req, res, next) {
    res.status(500).json({ error: err.message || "An error occured."});
    next();
  });
};

API.prototype.createServer = function createServer() {
  this.express = express();

  // configure ssl if requested
  if (this.ssl && typeof this.ssl === "object") {
    var https = require("https");

    this.server = https.createServer({
      key: fs.readFileSync(this.ssl.key),
      cert: fs.readFileSync(this.ssl.cert)
    }, this.express);
  } else {
    console.log("API using insecure connection.");
    console.log("We recommend using an SSL certificate with Cylon.");
    this.server = this.express;
  }
};

API.prototype.configureMiddleware = function configureMiddleware() {
  // auth
  this.express.use(this.setupAuth());

  // parse request bodies
  this.express.use(bodyParser.json());
  this.express.use(bodyParser.urlencoded({ extended: true }));

  // serve static content
  this.express.use(express.static(this.serveDir));

  // set CORS headers for API requests
  this.express.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", this.CORS || "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    return next();
  }.bind(this));

  // extracts command params from request
  this.express.use(function(req, res, next) {
    req.commandParams = _.values(req.body);
    return next();
  });

  // set Cylon/MCP in request
  this.express.use(function(req, res, next) {
    req.mcp = this.mcp;
    return next();
  }.bind(this));
};

API.prototype.loadRoutes = function loadRoutes() {
  this.express.use("/api", require("./routes"));
};

API.prototype.setupAuth = function setupAuth() {
  var authfn = function auth(req, res, next) { next(); };

  if (!this.auth || !this.auth.type) { return authfn; }

  var type = this.auth.type,
      module = "./auth/" + type,
      filename = path.join(__dirname, module + ".js"),
      exists = fs.existsSync(filename);

  if (exists) {
    authfn = require(filename)(this.auth);
  }

  return authfn;
};

API.prototype.start = API.prototype.listen = function() {
  var protocol = this.ssl ? "https" : "http",
      host = this.host,
      port = this.port;

  this.server.listen(this.port, this.host, null, function() {
    console.log("Cylon HTTP API server is now online.");
    console.log("Listening at %s://%s:%s", protocol, host, port);
  });
};
