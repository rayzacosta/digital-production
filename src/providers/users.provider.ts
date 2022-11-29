import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { UserRole } from 'src/persistence/user.dao';
import { handlerError } from 'src/helpers/error/handlerError';

export type User = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  processes?: {
    id: string;
    name: string;
  }[];
};

const useUser = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');

      setUsers(data);
    } catch (error) {
      handlerError(error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUserById(id: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/users/${id}`);

      setUser(data);
    } catch (error) {
      handlerError(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function createUser(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.post(`/users`, data);

      router.push('/users');
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateUser(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.put(`/users/${user?.id}`, data);
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteUser(id: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.delete(`/users/${id}`);
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addProcessesToUser(user_id: string, processes_id: string[]) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.patch(
        `/users/add-processes/${user_id}`,
        {
          processes_id,
        }
      );
    } catch (error) {
      handlerError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePassword(user_id: string, new_password: string) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.patch(
        `/users/change-password/${user_id}`,
        {
          new_password,
        }
      );
    } catch (error) {
      handlerError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      users,
      user,
      isLoading,
    },
    effects: {
      fetchUsers,
      fetchUserById,
      createUser,
      updateUser,
      addProcessesToUser,
      updatePassword,
      deleteUser,
    },
  };
};

export const [UsersProvider, useUserState, useUserEffects] = constate(
  useUser,
  (value) => value.state,
  (value) => value.effects
);
