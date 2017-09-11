"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanitize_1 = require("./sanitize");
exports.sanitize = sanitize_1.sanitize;
var config_1 = require("./sanitize/config");
exports.noImageText = config_1.noImageText;
exports.allowedTags = config_1.allowedTags;
