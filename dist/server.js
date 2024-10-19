"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const userRoutes_1 = require("./routes/userRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const server = (0, http_1.createServer)((req, res) => {
    (0, userRoutes_1.userRoutes)(req, res);
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
