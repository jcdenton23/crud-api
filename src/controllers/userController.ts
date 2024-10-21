import { IncomingMessage, ServerResponse } from 'http';
import { getUserById, createUser, updateUser, deleteUser } from '../db';
import { validateUUID } from '../utils';
import { User } from '../models/userModel';

export const MESSAGES = {
  INVALID_USER_ID: 'Invalid user ID',
  USER_NOT_FOUND: 'User not found',
  INVALID_INPUT: 'Invalid input',
  USER_CREATED: 'User created successfully',
  REQUIRED_INPUT:
    'Invalid input: username (string), age (number), and hobbies (array of strings) are required.',
};

export const handleGetUsers = (
  req: IncomingMessage,
  res: ServerResponse,
  users: User[]
) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const handleGetUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
  userId: string
) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_USER_ID }));
  }

  const user = getUserById(users, userId);
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

  if (
    !username ||
    typeof username !== 'string' ||
    typeof age !== 'number' ||
    isNaN(age) ||
    !Array.isArray(hobbies) ||
    !hobbies.every((hobby) => typeof hobby === 'string')
  ) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.REQUIRED_INPUT }));
  }

  const newUser = createUser(username, age, hobbies);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: MESSAGES.USER_CREATED, user: newUser }));
};

export const handleUpdateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
  userId: string,
  body: any
) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_USER_ID }));
  }

  const { username, age, hobbies } = body;
  if (
    !username ||
    typeof username !== 'string' ||
    typeof age !== 'number' ||
    isNaN(age) ||
    !Array.isArray(hobbies) ||
    !hobbies.every((hobby) => typeof hobby === 'string')
  ) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.REQUIRED_INPUT }));
  }
  const updatedUser = updateUser(users, userId, username, age, hobbies);
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
  users: User[],
  userId: string
) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: MESSAGES.INVALID_USER_ID }));
  }

  const deleted = deleteUser(users, userId);
  if (deleted) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: MESSAGES.USER_NOT_FOUND }));
  }
};
