"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUUID = void 0;
const uuid_1 = require("uuid");
const validateUUID = (id) => {
    return (0, uuid_1.validate)(id);
};
exports.validateUUID = validateUUID;
