"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUUID = exports.sendResponse = exports.parseBody = void 0;
const uuid_1 = require("uuid");
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            }
            catch (err) {
                reject(err);
            }
        });
    });
};
exports.parseBody = parseBody;
const sendResponse = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
};
exports.sendResponse = sendResponse;
const validateUUID = (id) => {
    return (0, uuid_1.validate)(id);
};
exports.validateUUID = validateUUID;
