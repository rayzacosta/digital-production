import { Moment } from 'moment';
import React from 'react';
import { Form } from 'react-bootstrap';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import 'moment/locale/pt-br';

export type DateValues = {
  startDate: Moment | null;
  endDate: Moment | null;
};

type DateRangeProps = {
  onChange: (props: DateValues) => void;
  value: DateValues;
  label: string;
};

export const DateRange = ({ value, onChange, label }: DateRangeProps) => {
  const id = React.useRef(Math.random().toString()).current;

  const [focusedInput, setFocusedInput] =
    React.useState<FocusedInputShape | null>(null);

  return (
    <Form.Group className="d-flex flex-column">
      <Form.Label>{label}</Form.Label>

      <DateRangePicker
        startDate={value.startDate}
        startDateId={`start_date_${id}`}
        endDate={value.endDate}
        startDatePlaceholderText="Início"
        endDatePlaceholderText="Fim"
        endDateId={`end_date_${id}`}
        isOutsideRange={() => false}
        isDayBlocked={() => false}
        onDatesChange={onChange}
        focusedInput={focusedInput}
        onFocusChange={setFocusedInput}
      />
    </Form.Group>
  );
};
