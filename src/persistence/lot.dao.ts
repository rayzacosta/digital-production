import moment from 'moment';
import { supabase } from 'src/clients/supabase';
import { getCurrentDate } from 'src/helpers/dates';
import { ProductDTO } from 'src/persistence/product.dao';

const TABLE_NAME = 'lot';

export type LotFilter = {
  id?: string;
  identifier?: string;
  cut?: string;
  start_completion_date?: string;
  end_completion_date?: string;
  product_id?: string;
};

export type LotDTO = {
  id: string;
  created_at: string;
  updated_at: string;
  amount: number;
  cut: boolean;
  cut_date?: string | Date;
  completion_date: string | Date;
  product: ProductDTO;
  product_id?: string;
  identifier: string;
  lot_process?: {
    amount: number;
    created_at: string;
    lot_id: string;
    process_id: string;
    remaining_amount: number;
  }[];
};

export type GeneratedProcessesDTO = {
  lot_id: string;
  process_id: string;
  amount: number;
  remaining_amount: number;
};

export class LotDAO {
  async list(): Promise<LotDTO[]> {
    const { data, error } = await supabase.from(TABLE_NAME).select(`
      *, 
      product(*)
      `);

    if (error) {
      throw error;
    }

    return data;
  }

  async filteredList(filter: LotFilter): Promise<LotDTO[]> {
    const query = supabase.from(TABLE_NAME).select(`
      *, 
      product(*)
      `);

    if (filter.start_completion_date) {
      query.gte('completion_date', filter.start_completion_date);
    }

    if (filter.end_completion_date) {
      query.lte('completion_date', filter.end_completion_date);
    }

    if (filter.product_id) {
      query.eq('product_id', filter.product_id);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  async read(id: string): Promise<LotDTO> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, product(id, name)')
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!data || !data[0]) {
      throw Error('Lote não encontrado');
    }

    return data[0];
  }

  async lotsAvailableToProduction(): Promise<LotDTO[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .is('completion_date', null);

    if (!!error) {
      throw error;
    }

    return data;
  }



  async update(id: string, data: any): Promise<LotDTO> {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data, updated_at: getCurrentDate() })
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!_data) {
      throw Error('Nenhum lote foi atualizado');
    }

    return _data[0];
  }

  async create(data: any): Promise<LotDTO> {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        { ...data, updated_at: getCurrentDate(), created_at: getCurrentDate() },
      ]);

    if (!!error) {
      throw error;
    }

    if (!_data?.[0]) {
      throw Error('Nenhum lote foi criado');
    }

    return _data[0];
  }

  async delete(id: string): Promise<LotDTO> {
    const { data, error, status } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (!!error) {
      console.log('error', error, status);
      if (status === 409) {
        throw Error(
          'Esse lote já está vinculado à outras tabelas a não pode ser removido enquanto houver vinculo'
        );
      }
      throw error;
    }
    if (!data || !data[0]) {
      throw Error(`Erro: Lote ${id} não removido`);
    }

    return data[0];
  }
}
