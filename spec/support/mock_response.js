"use strict";

// A mock version of http.ServerResponse to be used in tests
var MockResponse = module.exports = function MockResponse() {
  this.end = spy();
  this.headers = {};
  this.statuscode = 200;
  this.body = null;
};

MockResponse.prototype.setHeader = function setHeader(name, value) {
  this.headers[name] = value;
};

MockResponse.prototype.status = function status(code) {
  this.statuscode = code;
  return this;
};

MockResponse.prototype.json = function json(body) {
  this.body = body;
  return this;
};
