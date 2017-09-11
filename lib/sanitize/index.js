"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanitizeHtml = require("sanitize-html");
var config_1 = require("./config");
function sanitize(dirty, options) {
    if (options === void 0) { options = {}; }
    var conf = config_1.default(options);
    var clean = sanitizeHtml(dirty, conf);
    if (/<\s*script/ig.test(clean)) {
        // Not meant to be complete checking, just a secondary trap and red flag (code can change)
        return '';
    }
    return clean;
}
exports.sanitize = sanitize;
