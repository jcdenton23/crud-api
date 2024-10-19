"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const userController_1 = require("../controllers/userController");
const utils_1 = require("../utils");
const userRoutes = async (req, res) => {
    const { method, url } = req;
    if (!url) {
        (0, utils_1.sendResponse)(res, 400, { message: 'URL is required' });
        return;
    }
    const userId = url.split('/')[3];
    switch (method) {
        case 'GET':
            if (url === '/api/users') {
                return (0, userController_1.handleGetUsers)(req, res);
            }
            else if (url.startsWith('/api/users/') && userId) {
                return (0, userController_1.handleGetUserById)(req, res, userId);
            }
            else {
                (0, utils_1.sendResponse)(res, 400, { message: 'User ID is required' });
            }
            break;
        case 'POST':
            if (url === '/api/users') {
                try {
                    const body = await (0, utils_1.parseBody)(req);
                    return (0, userController_1.handleCreateUser)(req, res, body);
                }
                catch (err) {
                    (0, utils_1.sendResponse)(res, 400, { message: 'Invalid JSON' });
                }
            }
            break;
        case 'PUT':
            if (url.startsWith('/api/users/') && userId) {
                try {
                    const body = await (0, utils_1.parseBody)(req);
                    return (0, userController_1.handleUpdateUser)(req, res, userId, body);
                }
                catch (err) {
                    (0, utils_1.sendResponse)(res, 400, { message: 'Invalid JSON' });
                }
            }
            else {
                (0, utils_1.sendResponse)(res, 400, { message: 'User ID is required' });
            }
            break;
        case 'DELETE':
            if (url.startsWith('/api/users/') && userId) {
                return (0, userController_1.handleDeleteUser)(req, res, userId);
            }
            else {
                (0, utils_1.sendResponse)(res, 400, { message: 'User ID is required' });
            }
            break;
        default:
            (0, utils_1.sendResponse)(res, 404, { message: 'Not found' });
            break;
    }
};
exports.userRoutes = userRoutes;
