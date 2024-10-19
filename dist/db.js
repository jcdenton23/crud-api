"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const uuid_1 = require("uuid");
let users = [];
const getUsers = () => users;
exports.getUsers = getUsers;
const getUserById = (id) => users.find((user) => user.id === id);
exports.getUserById = getUserById;
const createUser = (username, age, hobbies) => {
    const newUser = { id: (0, uuid_1.v4)(), username, age, hobbies };
    users.push(newUser);
    return newUser;
};
exports.createUser = createUser;
const updateUser = (id, username, age, hobbies) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
        const updatedUser = { id, username, age, hobbies };
        users[userIndex] = updatedUser;
        return updatedUser;
    }
    return undefined;
};
exports.updateUser = updateUser;
const deleteUser = (id) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return true;
    }
    return false;
};
exports.deleteUser = deleteUser;
