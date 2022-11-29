import { supabase } from 'src/clients/supabase';
import { getCurrentDate } from 'src/helpers/dates';

const TABLE_NAME = 'process';
const TABLE_USER_PROCESS = 'user_process';

export type ProcessDTO = {
  id: string;
  name: string;
  goal: number;
  value_per_extra_piece?: number;
  order?: number;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
};

export class ProcessDAO {
  async list() {
    const { data, error } = await supabase.from(TABLE_NAME).select('*');

    if (error) {
      throw error;
    }

    return data;
  }

  async getByOrder(order: number) {
    const { data, error, status, statusText } = await supabase
      .from(TABLE_NAME)
      .select('*');

    if (error) {
      throw {
        error,
        status,
        statusText,
      };
    }

    return data?.find((item) => item.order === order);
  }

  async read(id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      throw Error('Process não encontrado');
    }

    return data[0];
  }

  async update(id: string, data: any) {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data, updated_at: getCurrentDate() })
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!_data) {
      throw Error('Nenhum processo foi atualizado');
    }

    return _data;
  }

  async create(data: any) {
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
      throw Error('Nenhum processo foi registrada');
    }

    return _data[0];
  }

  async delete(id: string) {
    const { data, error, status, statusText } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (!!error) {
      console.log('error', error, status);
      if (status === 409) {
        throw Error(
          'Esse processo já está vinculado à outras tabelas a não pode ser removido enquanto houver vinculo'
        );
      }
      throw error;
    }

    if (!data || !data[0]) {
      throw Error(`Processo ${id} não removido`);
    }

    return data[0];
  }
}
