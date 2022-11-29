import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { handlerError } from 'src/helpers/error/handlerError';

export type Process = {
  id: string;
  name: string;
  icon: string;
  order: number;
  value_per_extra_piece: number;
  goal: number;
};

const useProcesses = () => {
  const [processes, setProcesses] = React.useState<Process[]>([]);
  const [process, setProcess] = React.useState<Process | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function fetchProcesses() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/process');

      setProcesses(data);
    } catch (error) {
      setProcesses([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAvailableProcesses() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/process/available');

      setProcesses(data);
    } catch (error) {
      setProcesses([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProcessById(id: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/process/${id}`);

      setProcess(data);
    } catch (error) {
      setProcess(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function createProcess(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.post(`/process`, data);

      router.push('/process');
    } catch (error) {
      handlerError(error);
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProcess(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.patch(`/process/${process?.id}`, data);

      router.push('/processes');
    } catch (error) {
      handlerError(error);
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      process,
      processes,
      isLoading,
    },
    effects: {
      fetchProcesses,
      fetchAvailableProcesses,
      fetchProcessById,
      createProcess,
      updateProcess,
    },
  };
};

export const [ProcessesProvider, useProcessesState, useProcessesEffects] =
  constate(
    useProcesses,
    (value) => value.state,
    (value) => value.effects
  );
