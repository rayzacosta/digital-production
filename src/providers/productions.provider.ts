import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { handlerError } from 'src/helpers/error/handlerError';
import moment, { Moment } from 'moment';

type Production = {
  id: string;
  lot: {
    id: string;
    identifier: string;
    amount: number;
    product?: {
      id: string;
      name: string;
    };
  };
  process: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
  start_date: string;
  end_date: string;
  remaining_amount?: number;
};

const FORMAT_DATE = 'YYYY-MM-DD';

const useProductions = () => {
  const [productions, setProductions] = React.useState<Production[]>([]);
  const [production, setProduction] = React.useState<Production | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function fetchProductionsFiltered(
    user_id: string,
    start_date: Moment,
    end_date: Moment
  ) {
    setIsLoading(true);
    try {
      const { data } = await api.get('/production/filtered', {
        params: {
          user_id,
          start_date: start_date.format(FORMAT_DATE),
          end_date: end_date.format(FORMAT_DATE),
        },
      });

      setProductions(data);
    } catch (error) {
      setProductions([]);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProductionsInProgress() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/productions/in-progress');

      setProductions(data);
    } catch (error) {
      setProductions([]);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProductionById(id: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/production/${id}`);

      setProduction(data);
    } catch (error) {
      setProduction(null);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function registerStopProduction(production_id: string, amount: number) {
    setIsLoading(true);

    try {
      const { data } = await api.post(`/production/stop`, {
        production_id,
        amount,
      });

      console.log('registerStopProduction:::data:::', data);
      router.push('/mobile/processes');
    } catch (error) {
      console.log('registerStopProduction:::error::', error);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function registerStartProduction(
    lot_id: string,
    process_id: string,
    product_id?: string
  ) {
    setIsLoading(true);

    try {
      const { data } = await api.post(`/production/start`, {
        lot_id,
        process_id,
        product_id,
      });

      console.log('registerStartProduction:::data:::', data);

      router.push('/mobile/in-progress');
    } catch (error) {
      console.log('registerStartProduction:::error::', error);
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      productions,
      production,
      isLoading,
    },
    effects: {
      fetchProductionsInProgress,
      fetchProductionById,
      registerStopProduction,
      registerStartProduction,
      fetchProductionsFiltered,
    },
  };
};

export const [ProductionsProvider, useProductionsState, useProductionsEffects] =
  constate(
    useProductions,
    (value) => value.state,
    (value) => value.effects
  );
