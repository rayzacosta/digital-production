import { supabase } from 'src/clients/supabase';
import { getCurrentDate } from 'src/helpers/dates';

const TABLE_NAME = 'product';
const PRODUCT_PROCESS_TABLE = 'product_process';

export type ProductDTO = {
  id: string;
  name: string;
  cost_price?: number;
  sale_price?: number;
};

export class ProductDAO {
  async list() {
    const { data, error } = await supabase.from(TABLE_NAME).select(
      `
      *,
      processes: process(*)
    `
    );

    if (error) {
      throw error;
    }

    return data;
  }

  async read(id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
        *,
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

  async update(id: string, data: any) {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data, updated_at: getCurrentDate() })
      .eq('id', id);

    if (!!error) {
      throw error;
    }

    if (!_data) {
      throw Error('Nenhum produto foi atualizado');
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
      throw Error('Nenhum produto foi criado');
    }

    return _data[0];
  }

  async getProcessesFromProduct(product_id: string) {
    const { data, error } = await supabase
      .from(PRODUCT_PROCESS_TABLE)
      .select('*')
      .eq('product_id', product_id);

    if (!!error) {
      throw error;
    }

    return data;
  }

  private async deleteProcessesProduct(product_id: string) {
    const { error } = await supabase
      .from(PRODUCT_PROCESS_TABLE)
      .delete()
      .eq('product_id', product_id);

    if (error) {
      throw new Error(
        `Ocorreu um erro ao tentar excluir os processos do produto: ${product_id}`
      );
    }
  }

  async addProcessesToProduct(product_id: string, processes_id: string[]) {
    const items = processes_id.map((process_id) => ({
      process_id,
      product_id,
    }));

    await this.deleteProcessesProduct(product_id);

    const { data, error } = await supabase
      .from(PRODUCT_PROCESS_TABLE)
      .insert(items);

    if (error) {
      throw new Error(
        `Ocorreu um erro ao tentar adicionar os processos: ${processes_id}  para o produto: ${product_id}`
      );
    }

    return data;
  }

  async delete(id: string) {
    const processes_id = (await this.getProcessesFromProduct(id)).map(
      ({ process_id }) => String(process_id)
    );

    await this.deleteProcessesProduct(id);

    const { data, error, status } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (!!error) {
      console.log('error', error, status);
      if (status === 409) {
        // Reverting exclusion
        await this.addProcessesToProduct(id, processes_id);
        throw Error(
          'Esse produto já está vinculado à outras tabelas a não pode ser removido enquanto houver vinculo'
        );
      }
      throw error;
    }

    if (!data || !data[0]) {
      throw Error(`Produto ${id} não removido`);
    }

    return data[0];
  }
}
