"use strict";

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../models/User.js"));

var _cloudinary = require("../config/cloudinary");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var generateToken = function generateToken(id) {
  return _jsonwebtoken["default"].sign({
    id: id
  }, _cloudinary.JWT_SECRET, {
    expiresIn: _cloudinary.JWT_EXPIRES
  });
};

var ProtectRoutes = function ProtectRoutes(req, res, next) {
  return regeneratorRuntime.async(function ProtectRoutes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  });
};