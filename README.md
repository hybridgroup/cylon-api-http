# Cylon.js API plugin for HTTP

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things (IoT).

API plugins are separate from the Cylon.js main module, to allow for greater modularization of Cylon robots.

This repository contains the Cylon API plugin for HTTP.

For more information about Cylon, check out the repo at https://github.com/hybridgroup/cylon

[![Build Status](https://travis-ci.org/hybridgroup/cylon-api-socketio.svg)](https://travis-ci.org/hybridgroup/cylon-api-socketio)
[![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-api-socketio/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-api-socketio)
[![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-api-socketio/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-api-socketio)

## How To Install

    $ npm install cylon cylon-api-http

## How To Use

With both of these modules installed, you can make your robots accessible over HTTP:

```javascript
"use strict";

var Cylon = require("cylon");

Cylon.api("http", {
  ssl: false // serve unsecured, over HTTP

  // optional configuration here.
  // for details see 'Configuration' section.
});

Cylon.robot({
  name: "Maria",

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 }
  },

  work: function() {
    // we'll interact with this robot through the API
  }
}).start();
```

## How To Connect

Once you've got a Cylon instance with the API configured and running, you can use cURL to test it out:

      $ curl http://127.0.0.1:4000/api/robots/Maria
      { "robot": { "name": "Maria" /* ... */ } }

## Routes

This plugin follows the [CPPP-IO][] specification.

To get started, you can visit the `/api` route in your browser to get an overview of the Cylon Master Control Program (MCP).
This provides a high level overview of your program:

      $ curl http://127.0.0.1:4000/api | python -m json.tool
      {
          "MCP": {
              "commands": [ ],
              "events": [ ],
              "robots": [
                  {
                      "name": "Maria",
                      "connections": [
                          {
                              "name": "arduino",
                              "adaptor": "firmata",
                              "details": { "port": "/dev/ttyACM0" }
                          }
                      ],
                      "devices": [
                          {
                              "name": "led",
                              "commands": [ "toggle" ],
                              "connection": "arduino",
                              "details": { "pin": "13" },
                              "driver": "LED"
                          }
                      ],
                      "commands": [ ],
                      "events": [ ]
                  }
              ]
          }
      }

For details on other available routes in the API and expected responses, please see the [specification document][spec].

[CPPP-IO]: https://github.com/hybridgroup/cppp-io

## Robeaux

This plugin includes a default front-end in [Robeaux][].

Robeaux is a simple tool to use against the HTTP API, and explore your robots visually, while also able to issue commands to robots and listen for events.

## Configuration

Option     | Description
------     | -----------
`host`     | What HTTP host to serve from. Defaults to `127.0.0.1`.
`port`     | What HTTP port to serve on. Defaults to `3000`.
`auth`     | What authorization scheme to use. e.g. `{ type: "basic", user: "username", pass: "password"}`. Defaults to `false`.
`CORS`     | Cross-Origin Resource Sharing option (HTTP Header: "Access-Control-Allow-Origin"). Defaults to "*".
`serveDir` | Directory to serve as static assets. Defaults to the included [Robeaux][] installation.
`ssl`      | SSL `key` and `cert` options, wrapped as an object. Set to `false` for an unsecured API. Defaults to included self-signed certs.

[Robeaux]: https://github.com/hybridgroup/robeaux

## Documentation

We're busy adding documentation to [cylonjs.com](http://cylonjs.com). Please check there as we continue to work on Cylon.js.

Thank you!

## Contributing

For our contribution guidelines, please go to [https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md).

## Release History

For the release history, please go to [https://github.com/hybridgroup/cylon-api-http/blob/master/RELEASES.md](https://github.com/hybridgroup/cylon-api-http/blob/master/RELEASES.md).

## License

Copyright (c) 2014-2016 The Hybrid Group. Licensed under the Apache 2.0 license.
