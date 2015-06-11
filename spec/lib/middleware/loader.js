"use strict";

var loader = lib("middleware/loader");

var MockRequest = support("mock_request"),
    MockResponse = support("mock_response");

describe("Loader middleware", function() {
  var req, res, next, robot, connection, device;

  beforeEach(function() {
    req = new MockRequest();
    res = new MockResponse();

    req.mcp = {
      robots: {
        Ultron: {
          name: "Ultron",

          connections: {
            arduino: { name: "arduino" }
          },

          devices: {
            led: { name: "led" }
          }
        }
      }
    };

    robot = req.mcp.robots.Ultron;
    connection = robot.connections.arduino;
    device = robot.devices.led;

    next = spy();
  });

  context("with 'robot' param", function() {
    context("if the specified robot exists", function() {
      beforeEach(function() {
        req.params.robot = "Ultron";
        loader(req, res, next);
      });

      it("sets the robot as a request property", function() {
        expect(req.robot).to.be.eql(robot);
      });

      it("calls the next request handler", function() {
        expect(next).to.be.called;
      });
    });

    context("if the specified robot doesn't exist", function() {
      beforeEach(function() {
        req.params.robot = "Vision";
        loader(req, res, next);
      });

      it("returns a JSON error", function() {
        expect(res.statuscode).to.be.eql(404);
        expect(res.body).to.be.eql({
          error: "No robot found with the name Vision"
        });
      });

      it("does not call the next request handler", function() {
        expect(next).to.not.be.called;
      });
    });
  });

  context("with 'robot' and 'device' params", function() {
    beforeEach(function() {
      req.params.robot = "Ultron";
    });

    context("if the specified device exists", function() {
      beforeEach(function() {
        req.params.device = "led";
        loader(req, res, next);
      });

      it("sets the device as a request property", function() {
        expect(req.device).to.be.eql(device);
      });

      it("calls the next request handler", function() {
        expect(next).to.be.called;
      });
    });

    context("if the specified device doesn't exist", function() {
      beforeEach(function() {
        req.params.device = "button";
        loader(req, res, next);
      });

      it("returns a JSON error", function() {
        expect(res.statuscode).to.be.eql(404);
        expect(res.body).to.be.eql({
          error: "No device found with the name button"
        });
      });

      it("does not call the next request handler", function() {
        expect(next).to.not.be.called;
      });
    });
  });

  context("with 'robot' and 'connection' params", function() {
    beforeEach(function() {
      req.params.robot = "Ultron";
    });

    context("if the specified connection exists", function() {
      beforeEach(function() {
        req.params.connection = "arduino";
        loader(req, res, next);
      });

      it("sets the connection as a request property", function() {
        expect(req.connection).to.be.eql(connection);
      });

      it("calls the next request handler", function() {
        expect(next).to.be.called;
      });
    });

    context("if the specified connection doesn't exist", function() {
      beforeEach(function() {
        req.params.connection = "loopback";
        loader(req, res, next);
      });

      it("returns a JSON error", function() {
        expect(res.statuscode).to.be.eql(404);
        expect(res.body).to.be.eql({
          error: "No connection found with the name loopback"
        });
      });

      it("does not call the next request handler", function() {
        expect(next).to.not.be.called;
      });
    });
  });
});
