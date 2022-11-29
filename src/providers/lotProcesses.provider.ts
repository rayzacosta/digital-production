import constate from 'constate';
import React from 'react';
import { handlerError } from 'src/helpers/error/handlerError';
import { api } from 'src/services/api.service';

type LotProcess = {
  lot_id: string;
  process_id: string;
  lot: {
    id: string;
    identifier: string;
    product: {
      id: string;
      name: string;
    };
  };
  process: {
    id: string;
    name: string;
  };
  amount: number;
  remaining_amount: number;
  isCutProcess?: boolean;
};

const useLotProcesses = () => {
  const [availableLots, setAvailableLots] = React.useState<LotProcess[]>([]);
  const [lotProcess, setLotProcess] = React.useState<LotProcess | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  async function fetchAvailableLots(processId: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/lots/available/${processId}`);

      if (data) {
        setAvailableLots(data);
      }
    } catch (error) {
      setAvailableLots([]);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLotProcessById(lot_id: string, process_id: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/lots/available/details/${lot_id}?process_id=${process_id}`
      );

      setLotProcess(data);
    } catch (error) {
      setLotProcess(null);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      availableLots,
      lotProcess,
      isLoading,
    },
    effects: {
      fetchAvailableLots,
      fetchLotProcessById,
    },
  };
};

export const [
  LotProcessesProvider,
  useLotProcessesState,
  useLotProcessesEffects,
] = constate(
  useLotProcesses,
  (value) => value.state,
  (value) => value.effects
);
