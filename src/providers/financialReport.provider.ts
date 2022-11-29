import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { Moment } from 'moment';

const FORMAT_DATE = 'YYYY-MM-DD';

type FinancialReportFilter = {
  start_date: string;
  end_date: string;
  product_id?: string;
};

type FinancialReportProduct = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  cost_price: number;
  sale_price: number;
  financial: {
    cost_price: number;
    sale_price: number;
    amount_produced: number;
    amount_cost_value: number;
    amount_sale_value: number;
    profit: number;
  };
};

type FinancialReport = {
  filter: FinancialReportFilter;
  products: FinancialReportProduct[];
};

const useFinancialReport = () => {
  const [financialReport, setFinancialReport] = React.useState<FinancialReport | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // const router = useRouter();

  async function fetchFinancialReport(
    start_date: Moment,
    end_date: Moment,
    product_id?: string
  ) {
    setIsLoading(true);
    try {
      const { data } = await api.get('/production/financial-report', {
        params: {
          start_date: start_date.format(FORMAT_DATE),
          end_date: end_date.format(FORMAT_DATE),
          product_id,
        },
      });

      setFinancialReport(data);
    } catch (error) {
      setFinancialReport(null);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      financialReport,
      isLoading,
    },
    effects: {
      fetchFinancialReport,
    },
  };
};

export const [
  FinancialReportProvider,
  useFinancialReportState,
  useFinancialReportEffects,
] = constate(
  useFinancialReport,
  (value) => value.state,
  (value) => value.effects
);
