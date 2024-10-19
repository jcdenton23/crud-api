"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteUser = exports.handleUpdateUser = exports.handleCreateUser = exports.handleGetUserById = exports.handleGetUsers = void 0;
const db_1 = require("../db");
const utils_1 = require("../utils");
const handleGetUsers = (req, res) => {
    const users = (0, db_1.getUsers)();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
};
exports.handleGetUsers = handleGetUsers;
const handleGetUserById = (req, res, userId) => {
    if (!(0, utils_1.validateUUID)(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid user ID' }));
    }
    const user = (0, db_1.getUserById)(userId);
    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(user));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User not found' }));
    }
};
exports.handleGetUserById = handleGetUserById;
const handleCreateUser = (req, res, body) => {
    const { username, age, hobbies } = body;
    if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid input' }));
    }
    const newUser = (0, db_1.createUser)(username, age, hobbies);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
};
exports.handleCreateUser = handleCreateUser;
const handleUpdateUser = (req, res, userId, body) => {
    if (!(0, utils_1.validateUUID)(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid user ID' }));
    }
    const { username, age, hobbies } = body;
    const updatedUser = (0, db_1.updateUser)(userId, username, age, hobbies);
    if (updatedUser) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
};
exports.handleUpdateUser = handleUpdateUser;
const handleDeleteUser = (req, res, userId) => {
    if (!(0, utils_1.validateUUID)(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid user ID' }));
    }
    const deleted = (0, db_1.deleteUser)(userId);
    if (deleted) {
        res.writeHead(204);
        res.end();
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
};
exports.handleDeleteUser = handleDeleteUser;
