import { supabase } from 'src/clients/supabase';
import { ProductDTO } from 'src/persistence/product.dao';

const TABLE_NAME = 'lot_process';

export type LotProcessDTO = {
  lot_id: string;
  process_id: string;
  remaining_amount: number;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type GeneratedProcessesDTO = {
  lot_id: string;
  process_id: string;
  amount: number;
  remaining_amount: number;
};

export class LotProcessDAO {
  async lotProcessesAvailableToProduction(
    process_id?: string
  ): Promise<LotProcessDTO[]> {
    const query = supabase
      .from(TABLE_NAME)
      .select(
        `
      *,
      lot(*, product(id, name))
    `
      )
      .neq('remaining_amount', 0);

    if (process_id) {
      query.eq('process_id', process_id);
    }

    const { data, error } = await query;

    if (!!error) {
      throw error;
    }

    return data;
  }

  async getLotProcess(
    lot_id: string,
    process_id: string
  ): Promise<LotProcessDTO> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
        *,
        lot(
          id,
          identifier,
          product(
            id,
            name
          )
        ),
        process(
          id,
          name
        )
      `
      )
      .eq('lot_id', lot_id)
      .eq('process_id', process_id);

    if (!!error) {
      throw error;
    }

    // if (!data || !data[0]) {
    //   throw Error(`Processo não encontrado para o lote: ${lot_id}`);
    // }

    return data?.[0];
  }

  async updateLotProcess(
    lot_id: string,
    process_id: string,
    data: { amount?: number; remaining_amount?: number }
  ) {
    const { data: _data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data })
      .eq('lot_id', lot_id)
      .eq('process_id', process_id);

    if (!!error) {
      throw error;
    }

    if (!_data) {
      throw Error(
        `Erro ao tentar atualizar. Nenhum processo do lote: ${lot_id} foi atualizado`
      );
    }

    return _data[0];
  }

  async getProcessesByLot(lot_id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('lot_id', lot_id);

    if (!!error) {
      throw new Error(
        `Ocorreu um erro ao tentar buscar os processos do lote: ${lot_id}`
      );
    }

    return data || [];
  }

  async saveGeneratedProcesses(items: GeneratedProcessesDTO[]) {
    const { data, error } = await supabase.from(TABLE_NAME).insert(items);

    if (!!error) {
      console.log('saveGeneratedProcesses:::error:::', error);
      throw new Error(
        'Ocorreu um erro ao tentar salvar o processos gerados pelo corte'
      );
    }

    return data;
  }
}
