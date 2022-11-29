import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import Crypto from 'crypto-js';

import { api } from './api.service';
import { UserDAO } from 'src/persistence/user.dao';
import { userCreateSchema } from 'src/helpers/validations/user';
import { CurrentUser } from 'src/types/userSession';

type UserRole = 'admin' | 'manager' | 'operator';

type User = {
  name: string;
  username: string;
  password: string;
  role: UserRole;
};

const userSubject = new BehaviorSubject<Omit<User, 'password'> | null>(
  process.browser && JSON.parse(localStorage.getItem('user') as any)
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  getAll,
};

async function login(username: string, password: string) {
  const apiInstance = axios.create({
    baseURL: '/api',
  });

  const { data } = await apiInstance.post('/users/authenticate', {
    username,
    password,
  });

  userSubject.next(data);
  localStorage.setItem('user', JSON.stringify(data));

  console.log('data::', data);

  return data;
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem('user');
  userSubject.next(null);
  Router.push('/login');
}

function getAll() {
  return api.get('/users');
}

const DEFAULT_PASSWORD = '1234';

export class UserService {
  private readonly userDao;

  constructor() {
    this.userDao = new UserDAO();
  }

  async list() {
    return await this.userDao.list();
  }

  encryptPass(pass: string) {
    return Crypto.MD5(pass).toString();
  }

  async read(id: string) {
    return await this.userDao.read(id);
  }

  async updatePassword(user_id: string, new_password: string) {
    if (new_password.length < 4) {
      throw new Error('A senha deve conter mais de 4 caracteres');
    }

    return await this.userDao.update(user_id, {
      password: this.encryptPass(new_password),
    });
  }

  async create(data: Omit<User, 'role'>) {
    const { name, username } = data;

    const userAlreadyExist = await this.userDao.findByUsername(username);

    if (!!userAlreadyExist) {
      throw new Error('O usuário já existe');
    }

    await userCreateSchema.validate({
      name,
      password: DEFAULT_PASSWORD,
      username,
    });

    const createdUser = await this.userDao.create({
      password: this.encryptPass(DEFAULT_PASSWORD),
      name,
      username,
      role: 'operator',
    });

    return {
      id: createdUser.id,
      username: createdUser.username,
      name: createdUser.name,
      role: createdUser.role,
      // TODO: temporally
      // password: createdUser.password,
    };
  }

  async update(id: string, data: any, current_user: CurrentUser) {
    if (current_user.role !== 'admin') {
      throw new Error(
        'Você precisa ter permissão de administrador para editar um usuário'
      );
    }

    return await this.userDao.update(id, data);
  }

  async addProcessesToUser(user_id: string, processes_id: string[]) {
    if (!user_id) {
      throw new Error('O id do produto é obrigatório!');
    }

    if (!processes_id || !processes_id.length) {
      throw new Error('Os processos são obrigatório!');
    }

    return this.userDao.addProcessesToUser(user_id, processes_id);
  }

  async getUser(username: string, password: string) {
    const _password = this.encryptPass(password);

    return await this.userDao.findByUser(username, _password);
  }
}
