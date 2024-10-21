import { IncomingMessage, ServerResponse } from 'http';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../db';
import { validateUUID } from '../utils';

const MESSAGES = {
  INVALID_USER_ID: 'Invalid user ID',
  USER_NOT_FOUND: 'User not found',
  INVALID_INPUT: 'Invalid input',
  USER_CREATED: 'User created successfully',
};

export const handleGetUsers = (req: IncomingMessage, res: ServerResponse) => {
  const users = getUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const handleGetUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_USER_ID }));
  }

  const user = getUserById(userId);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.USER_NOT_FOUND }));
  }
};

export const handleCreateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  body: any
) => {
  const { username, age, hobbies } = body;

  if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_INPUT }));
  }

  const newUser = createUser(username, age, hobbies);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: MESSAGES.USER_CREATED, user: newUser }));
};

export const handleUpdateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
  body: any
) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_USER_ID }));
  }

  const { username, age, hobbies } = body;

  const updatedUser = updateUser(userId, username, age, hobbies);
  if (updatedUser) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: MESSAGES.USER_NOT_FOUND }));
  }
};

export const handleDeleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_USER_ID }));
  }

  const deleted = deleteUser(userId);
  if (deleted) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: MESSAGES.USER_NOT_FOUND }));
  }
};
