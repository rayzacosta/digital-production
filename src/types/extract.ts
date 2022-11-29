export type ExtractResult = {
  start_date: string;
  end_date: string;
  avg_daily: number;
  avg_per_hour: number;
  value_to_pay: number;
  amount_total_produced: number;
  amount_extra_produced: number;
  avg_target_daily: number;
  avg_value_per_part: number;
  amount_worked_days: number;
  user: {
    id: string;
    name: string;
  };
};
