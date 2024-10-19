import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../db';
import { validateUUID } from '../utils';


export const handleGetUsers = (req: IncomingMessage, res: ServerResponse) => {
  const users = getUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const handleGetUserById = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid user ID' }));
  }

  const user = getUserById(userId);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }
};

export const handleCreateUser = (req: IncomingMessage, res: ServerResponse, body: any) => {
  const { username, age, hobbies } = body;

  if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid input' }));
  }

  const newUser = createUser(username, age, hobbies);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(newUser));
};

export const handleUpdateUser = (req: IncomingMessage, res: ServerResponse, userId: string, body: any) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid user ID' }));
  }

  const { username, age, hobbies } = body;

  const updatedUser = updateUser(userId, username, age, hobbies);
  if (updatedUser) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
};

export const handleDeleteUser = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!validateUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid user ID' }));
  }

  const deleted = deleteUser(userId);
  if (deleted) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
};
