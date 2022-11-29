import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { handlerError } from 'src/helpers/error/handlerError';

type Lot = {
  id: string;
  identifier: string;
  amount: number;
  product_id: string;
  cut?: boolean;
};

const useLots = () => {
  const [lots, setLots] = React.useState<Lot[]>([]);
  const [lot, setLot] = React.useState<Lot | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function fetchLots() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/lots');

      setLots(data);
    } catch (error) {
      setLots([]);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLotById(id: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/lots/${id}`);

      setLot(data);
    } catch (error) {
      setLot(null);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createLot(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.post(`/lots`, { ...data });

      router.push('/lots');
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateLot(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.patch(`/lots/${lot?.id}`, { ...data });

      router.push('/lots');
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteLot(id: string) {
    const willDelete = confirm(
      'Tem certeza que deseja excluir esse item? Essa ação é irreversível'
    );

    if (!willDelete) {
      return;
    }

    try {
      const { data: _data } = await api.delete(`/lots/${id}`);

      fetchLots();
    } catch (error) {
      handlerError(error);
    }
  }

  return {
    state: {
      lots,
      lot,
      isLoading,
      // availableLots,
    },
    effects: {
      fetchLots,
      fetchLotById,
      createLot,
      updateLot,
      deleteLot,
    },
  };
};

export const [LotsProvider, useLotsState, useLotsEffects] = constate(
  useLots,
  (value) => value.state,
  (value) => value.effects
);
