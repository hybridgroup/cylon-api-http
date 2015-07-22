/*
 * Cylon API - Route Definitions
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

/* eslint new-cap: 0, quote-props: 0, max-len: 0 */

var router = module.exports = require("express").Router();

var get = router.get.bind(router),
    post = router.post.bind(router),
    all = router.all.bind(router);

var loader = require("./middleware/loader");

var eventHeaders = {
  "Content-Type": "text/event-stream",
  "Connection": "keep-alive",
  "Cache-Control": "no-cache"
};

// Run an MCP, Robot, or Device command.  Process the results immediately,
// or asynchronously if the result is a Promise.
function runCommand(req, res, my, command) {
  var result = command.apply(my, req.commandParams),
      promise = typeof result === "object" && typeof result.then === "function";

  function respond(r) { res.json({ result: r }); }
  function error(err) { res.status(500).json({ error: err }); }

  return promise ? result.then(respond).catch(error) : respond(result);
}

get("/", function(req, res) {
  res.json({ MCP: req.mcp.toJSON() });
});

get("/events", function(req, res) {
  res.json({ events: req.mcp.events });
});

get("/events/:event", function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  req.mcp.on(event, writeData);

  res.on("close", function() {
    req.mcp.removeListener(event, writeData);
  });
});

get("/commands", function(req, res) {
  res.json({ commands: Object.keys(req.mcp.commands) });
});

post("/commands/:command", function(req, res) {
  var command = req.mcp.commands[req.params.command];
  runCommand(req, res, req.mcp, command);
});

get("/robots", function(req, res) {
  res.json({ robots: req.mcp.toJSON().robots });
});

get("/robots/:robot", loader, function(req, res) {
  res.json({ robot: req.robot });
});

get("/robots/:robot/commands", loader, function(req, res) {
  res.json({ commands: Object.keys(req.robot.commands) });
});

all("/robots/:robot/commands/:command", loader, function(req, res) {
  var command = req.robot.commands[req.params.command];
  runCommand(req, res, req.robot, command);
});

get("/robots/:robot/events", loader, function(req, res) {
  res.json({ events: req.robot.events });
});

all("/robots/:robot/events/:event", loader, function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  req.robot.on(event, writeData);

  res.on("close", function() {
    req.robot.removeListener(event, writeData);
  });
});

get("/robots/:robot/devices", loader, function(req, res) {
  res.json({ devices: req.robot.toJSON().devices });
});

get("/robots/:robot/devices/:device", loader, function(req, res) {
  res.json({ device: req.device });
});

get("/robots/:robot/devices/:device/events", loader, function(req, res) {
  res.json({ events: req.device.events });
});

get("/robots/:robot/devices/:device/events/:event", loader, function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  function writeData(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }

  req.device.on(event, writeData);

  res.on("close", function() {
    req.device.removeListener(event, writeData);
  });
});

get("/robots/:robot/devices/:device/commands", loader, function(req, res) {
  res.json({ commands: Object.keys(req.device.commands) });
});

all("/robots/:robot/devices/:device/commands/:command", loader, function(req, res) {
  var command = req.device.commands[req.params.command];
  runCommand(req, res, req.device, command);
});

get("/robots/:robot/connections", loader, function(req, res) {
  res.json({ connections: req.robot.toJSON().connections });
});

get("/robots/:robot/connections/:connection", loader, function(req, res) {
  res.json({ connection: req.connection });
});
