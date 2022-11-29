import { supabase } from 'src/clients/supabase';
import { getCurrentDate } from 'src/helpers/dates';
import { ProcessDTO } from './process.dao';

const TABLE_NAME = 'user';
const USER_PROCESS_TABLE = 'user_process';

export type UserRole = 'operator' | 'admin' | 'manager';

type UserType = {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  processes?: Partial<ProcessDTO>[];
};

export class UserDAO {
  async list() {
    const { data, error } = await supabase.from(TABLE_NAME).select(
      `
        id,
        name,
        role,
        username,
        updated_at,
        created_at
      `
    );

    if (error) {
      throw error;
    }

    return data;
  }

  async addProcessesToUser(user_id: string, processes_id: string[]) {
    const items = processes_id.map((process_id) => ({
      process_id,
      user_id,
    }));

    const { error: errorDelete } = await supabase
      .from(USER_PROCESS_TABLE)
      .delete()
      .eq('user_id', user_id);

    if (errorDelete) {
      throw new Error(
        `Ocorreu um erro ao tentar excluir os processos do usuário: ${user_id}`
      );
    }

    const { data, error } = await supabase
      .from(USER_PROCESS_TABLE)
      .insert(items);

    if (error) {
      throw new Error(
        `Ocorreu um erro ao tentar adicionar os processos: ${processes_id}  para o usuário: ${user_id}`
      );
    }

    return data;
  }

  async read(id: string): Promise<UserType> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
          id,
          name,
          role,
          username,
          updated_at,
          created_at,
          processes: process(*)
        `
      )
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      throw Error('Produto não encontrado');
    }

    return data[0];
  }

  async findByUsername(username: string): Promise<UserType | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
          id,
          name,
          role,
          username,
          updated_at,
          created_at
        `
      )
      .eq('username', username);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      return null;
    }

    return data[0];
  }

  async findByUser(username: string, password: string): Promise<UserType> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
          id,
          name,
          role,
          username,
          updated_at,
          created_at
        `
      )
      .eq('username', username)
      .eq('password', password);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      throw Error('Usuário e Senha Inválidos');
    }

    return data[0];
  }

  async update(id: string, data: any): Promise<UserType[]> {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data, updated_at: getCurrentDate() })
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!_data) {
      throw Error('Nenhum usuário foi atualizado');
    }

    return _data;
  }

  async create(data: any): Promise<UserType> {
    const { data: _data, error } = await supabase.from(TABLE_NAME).insert([
      {
        ...data,
        updated_at: getCurrentDate(),
        created_at: getCurrentDate(),
      },
    ]);

    if (!!error) {
      throw error;
    }

    if (!_data?.[0]) {
      throw Error('Nenhum usuário foi criado');
    }

    return _data[0];
  }

  async delete(id: string): Promise<UserType> {
    const { data, error, status } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (!!error) {
      console.log('error', error, status);
      if (status === 409) {
        throw Error(
          'Esse usuário já está vinculado à outras tabelas a não pode ser removido enquanto houver vinculo'
        );
      }
      throw error;
    }

    if (!data || !data[0]) {
      throw Error(`Usuário ${id} não removido`);
    }

    return data[0];
  }
}
