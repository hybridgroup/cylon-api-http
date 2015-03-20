/*
 * Cylon HTTP API - Loader Middleware
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

// loads robot/device/connection as appropriate for the current request
module.exports = function loader(req, res, next) {
  var robot = req.params.robot,
      device = req.params.device,
      connection = req.params.connection;

  if (robot) {
    req.robot = req.mcp.robots[robot];
    if (!req.robot) {
      return res.status(404).json({
        error: "No robot found with the name " + robot
      });
    }
  }

  if (robot && device) {
    req.device = req.robot.devices[device];
    if (!req.device) {
      return res.status(404).json({
        error: "No device found with the name " + device
      });
    }
  }

  if (robot && connection) {
    req.connection = req.robot.connections[connection];
    if (!req.connection) {
      return res.status(404).json({
        error: "No connection found with the name " + connection
      });
    }
  }

  next();
};
