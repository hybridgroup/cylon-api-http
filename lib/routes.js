/* jshint maxlen: false */

/*
 * Cylon API - Route Definitions
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var router = module.exports = require("express").Router();

var loader = require("./middleware/loader");

var eventHeaders = {
  "Content-Type": "text/event-stream",
  "Connection": "keep-alive",
  "Cache-Control": "no-cache"
};

router.get("/", function(req, res) {
  res.json({ MCP: req.mcp.toJSON() });
});

router.get("/events", function(req, res) {
  res.json({ events: req.mcp.events });
});

router.get("/events/:event", function(req, res) {
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

router.get("/commands", function(req, res) {
  res.json({ commands: Object.keys(req.mcp.commands) });
});

router.post("/commands/:command", function(req, res) {
  var command = req.mcp.commands[req.params.command];
  router.runCommand(req, res, req.mcp, command);
});

router.get("/robots", function(req, res) {
  res.json({ robots: req.mcp.toJSON().robots });
});

router.get("/robots/:robot", loader, function(req, res) {
  res.json({ robot: req.robot });
});

router.get("/robots/:robot/commands", loader, function(req, res) {
  res.json({ commands: Object.keys(req.robot.commands) });
});

router.all("/robots/:robot/commands/:command", loader, function(req, res) {
  var command = req.robot.commands[req.params.command];
  router.runCommand(req, res, req.robot, command);
});

router.get("/robots/:robot/events", loader, function(req, res) {
  res.json({ events: req.robot.events });
});

router.all("/robots/:robot/events/:event", loader, function(req, res) {
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

router.get("/robots/:robot/devices", loader, function(req, res) {
  res.json({ devices: req.robot.toJSON().devices });
});

router.get("/robots/:robot/devices/:device", loader, function(req, res) {
  res.json({ device: req.device });
});

router.get("/robots/:robot/devices/:device/events", loader, function(req, res) {
  res.json({ events: req.device.events });
});

router.get("/robots/:robot/devices/:device/events/:event", loader, function(req, res) {
  var event = req.params.event;

  res.writeHead(200, eventHeaders);

  var writeData = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  req.device.on(event, writeData);

  res.on("close", function() {
    req.device.removeListener(event, writeData);
  });
});

router.get("/robots/:robot/devices/:device/commands", loader, function(req, res) {
  res.json({ commands: Object.keys(req.device.commands) });
});

router.all("/robots/:robot/devices/:device/commands/:command", loader, function(req, res) {
  var command = req.device.commands[req.params.command];
  router.runCommand(req, res, req.device, command);
});

router.get("/robots/:robot/connections", loader, function(req, res) {
  res.json({ connections: req.robot.toJSON().connections });
});

router.get("/robots/:robot/connections/:connection", loader, function(req, res) {
  res.json({ connection: req.connection });
});

// Run an MCP, Robot, or Device command.  Process the results immediately,
// or asynchronously if the result is a Promise.
router.runCommand = function(req, res, my, command) {
  var result = command.apply(my, req.commandParams);

  if (typeof result === "object" && typeof result.then === "function") {
    result
      .then(function(result) {return res.json({result: result});})
      .catch(function(err) {return res.status(500).json({error: err});});
  }
  else {
    res.json({ result: result });
  }
};
