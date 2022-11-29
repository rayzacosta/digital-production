import { supabase } from 'src/clients/supabase';
import { getCurrentDate } from 'src/helpers/dates';
import { LotDTO } from './lot.dao';
import { ProcessDTO } from './process.dao';

const TABLE_NAME = 'production';

type DefaultProps = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type ProductionDTO = DefaultProps & {
  lot_id: string;
  user_id: string;
  process_id: string;
  start_date: string | Date;
  end_date: string | Date;
  amount: number;
};

export type ProductionFilteredListResult = DefaultProps & {
  id: string;
  lot_id: string;
  user_id: string;
  process_id: string;
  start_date: string | Date;
  end_date: string | Date;
  amount: number;
  lot: DefaultProps & {
    amount: number;
    cut: boolean;
    cut_date?: string;
    completion_date?: string;
    product_id: string;
    product: {
      id: string;
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
  };
  process: ProcessDTO;
};

export type ProductionType = Omit<
  ProductionDTO,
  'lot_id' | 'user_id' | 'process_id'
> & {
  user: {
    id: string;
    username: string;
  };
  lot: LotDTO;
  process: ProcessDTO;
};

type ListFilteredParams = {
  process_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
};

export class ProductionDAO {
  async list(): Promise<ProductionType[]> {
    const { data, error } = await supabase.from(TABLE_NAME).select(`
      *,
      lot(*),
      user(
        id,
        username
      ),
      process(*)
    `);

    if (error) {
      throw error;
    }

    return data;
  }

  async listFiltered(
    { process_id, user_id, start_date, end_date }: ListFilteredParams,
    inProgress?: boolean
  ): Promise<ProductionFilteredListResult[]> {
    const query = supabase.from(TABLE_NAME).select(
      `
      *,
      lot(*, product(id, name)),
      process(*),
      user(id, name)
    `
    );

    if (start_date) {
      query.gte('start_date', start_date);
    }

    if (end_date) {
      query.lte('end_date', end_date);
    }

    if (user_id) {
      query.eq('user_id', user_id);
    }

    if (process_id) {
      query.eq('process_id', process_id);
    }

    if (inProgress) {
      query.is('end_date', null);
    }

    const { data, error } = await query;

    if (!!error) {
      console.log('error:::', error);
      throw error;
    }

    return data;
  }

  async read(id: string): Promise<ProductionType> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
      *,
      lot(*, product(id, name), lot_process(*)),
      user(
        id,
        username,
        name
      ),
      process(*)
    `
      )
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      throw Error('Produção não encontrada');
    }

    return data[0];
  }

  async update(id: string, data: Partial<ProductionDTO>) {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data, updated_at: getCurrentDate() })
      .eq('id', id);

    if (!!error) {
      console.log(`table::${TABLE_NAME}::`, error);
      throw error;
    }

    if (!_data) {
      throw Error('Nenhuma produção foi atualizado');
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
      throw Error('Nenhum produção foi registrada');
    }

    return _data[0];
  }

  async delete(id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      throw Error(`Produção ${id} não removida`);
    }

    return data[0];
  }
}
