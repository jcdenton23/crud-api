import { v4 as uuidv4 } from 'uuid';
import { User } from './models/userModel';

let users: User[] = [];

export const getUsers = (): User[] => users;

export const getUserById = (users: User[], id: string): User | undefined =>
  users.find((user) => user.id === id);

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
): User => {
  const newUser: User = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);
  return newUser;
};

export const updateUser = (
  users: User[],
  id: string,
  username: string,
  age: number,
  hobbies: string[]
): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    const updatedUser = { id, username, age, hobbies };
    users[userIndex] = updatedUser;
    return updatedUser;
  }
  return undefined;
};

export const deleteUser = (users: User[], id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    return true;
  }
  return false;
};
