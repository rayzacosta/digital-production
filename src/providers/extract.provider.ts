import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { Moment } from 'moment';

const FORMAT_DATE = 'YYYY-MM-DD';

const useExtract = () => {
  const [extract, setExtract] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // const router = useRouter();

  async function fetchExtract(
    user_id: string,
    start_date: Moment,
    end_date: Moment
  ) {
    setIsLoading(true);
    try {
      const { data } = await api.get('/production/extract', {
        params: {
          user_id,
          start_date: start_date.format(FORMAT_DATE),
          end_date: end_date.format(FORMAT_DATE),
        },
      });

      setExtract(data);
    } catch (error) {
      setExtract(null);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      extract,
      isLoading,
    },
    effects: {
      fetchExtract,
    },
  };
};

export const [ExtractProvider, useExtractState, useExtractEffects] = constate(
  useExtract,
  (value) => value.state,
  (value) => value.effects
);
