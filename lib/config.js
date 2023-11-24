"use strict";

var cov_bka5bqess = function () {
  var path = "/home/jfontirroig/pact/api-chat/src/config.js";
  var hash = "e6979da3b54f120f1be2da21a418440c90d360b8";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/jfontirroig/pact/api-chat/src/config.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 23
        },
        end: {
          line: 18,
          column: 1
        }
      },
      "1": {
        start: {
          line: 21,
          column: 17
        },
        end: {
          line: 21,
          column: 50
        }
      },
      "2": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 26,
          column: 5
        }
      },
      "3": {
        start: {
          line: 24,
          column: 27
        },
        end: {
          line: 24,
          column: 49
        }
      },
      "4": {
        start: {
          line: 25,
          column: 8
        },
        end: {
          line: 25,
          column: 70
        }
      },
      "5": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 43,
          column: 5
        }
      },
      "6": {
        start: {
          line: 45,
          column: 4
        },
        end: {
          line: 45,
          column: 17
        }
      }
    },
    fnMap: {
      "0": {
        name: "getConfig",
        decl: {
          start: {
            line: 20,
            column: 16
          },
          end: {
            line: 20,
            column: 25
          }
        },
        loc: {
          start: {
            line: 20,
            column: 28
          },
          end: {
            line: 46,
            column: 1
          }
        },
        line: 20
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 26,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 26,
            column: 5
          }
        }, {
          start: {
            line: 23,
            column: 4
          },
          end: {
            line: 26,
            column: 5
          }
        }],
        line: 23
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184",
    hash: "e6979da3b54f120f1be2da21a418440c90d360b8"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }
  return coverage[path] = coverageData;
}();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
var _winston = _interopRequireDefault(require("winston"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const configDefaults = (cov_bka5bqess.s[0]++, {
  winstonConsoleTransport: {
    level: 'info',
    handleExceptions: false,
    timestamp: true,
    stringify: true,
    colorize: true,
    json: false
  },
  domainName: 'api-chat.id',
  dbLocation: '/home/paradigma/api-chat/registrar_db/api-chat.db',
  port: 3080,
  prometheus: {
    start: false,
    port: 0
  },
  minBatchSize: 1
});
function getConfig() {
  cov_bka5bqess.f[0]++;
  let config = (cov_bka5bqess.s[1]++, Object.assign({}, configDefaults));
  cov_bka5bqess.s[2]++;
  if (process.env.API_CONFIG) {
    cov_bka5bqess.b[0][0]++;
    const configFile = (cov_bka5bqess.s[3]++, process.env.API_CONFIG);
    cov_bka5bqess.s[4]++;
    Object.assign(config, JSON.parse(_fs.default.readFileSync(configFile)));
  } else {
    cov_bka5bqess.b[0][1]++;
  }
  cov_bka5bqess.s[5]++;
  config.winstonConfig = {
    transports: [new _winston.default.transports.Console(config.winstonConsoleTransport), new _winston.default.transports.File({
      maxsize: 5120000,
      maxFiles: 10,
      filename: `${__dirname}/../logs/api-chat.log`,
      level: 'debug',
      handleExceptions: false,
      timestamp: true,
      stringify: true,
      colorize: false,
      json: false
    })]
  };
  cov_bka5bqess.s[6]++;
  return config;
}