import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CharBar } from 'src/components/ChartBar';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { useRefDimensions } from 'src/hooks/useRefDefinitions';
import { faker } from '@faker-js/faker';

import { userService } from 'src/services';
import moment from 'moment';
import Head from 'next/head';
import { withProvider } from 'src/hocs/withProvider';
import {
  Product,
  ProductsProvider,
  useProductsEffects,
  useProductsState,
} from 'src/providers/products.provider';

const COLORS = [
  '#6667AB',
  '#F18AAD',
  '#EA6759',
  '#F88F58',
  '#F3C65F',
  '#8BC28C',
];

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const getBars = (products: Product[], colors: string[]) => {
  return products.map((product, i: number) => {
    return {
      dataKey: product.name,
      fill: colors[i],
    };
  });
};

const isPastMonth = (year: number, month: number) => {
  const currentYear = moment().get('year');
  const currentMonth = moment().get('month') + 1;

  if (year < currentYear) {
    return true;
  }

  if (year > currentYear) {
    return false;
  }

  return month <= currentMonth;
};

const getAnualData = (year: number, products: Product[]) => {
  const data = MONTHS.map((month, idx) => {
    const productsData: any = {};

    const currentMonth = idx + 1;

    const pastMonth = isPastMonth(year, currentMonth);

    products.forEach((product) => {
      const value = pastMonth
        ? faker.datatype.number({ min: 1200, max: 5000 })
        : 0;

      productsData[product.name] = value;
    });

    return {
      name: month,
      ...productsData,
    };
  });

  return {
    data,
    bars: getBars(products, COLORS.slice(0)),
  };
};

function getNumWeeksForMonth(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  const day = date.getDay();
  const numDaysInMonth = new Date(year, month, 0).getDate();

  return Math.ceil((numDaysInMonth + day) / 7);
}

const getWeeksByMonth = (year: number, month: number) => {
  return Array.from({ length: getNumWeeksForMonth(year, month) }).map(
    (_, i) => i + 1
  );
};

const getMonthlyData = (year: number, month: number, products: Product[]) => {
  const weeks = getWeeksByMonth(year, month);

  const data = weeks.map((week, i) => {
    const productsData: any = {};

    const pastMonth = isPastMonth(year, month);

    // const pastWeek

    products.forEach((product) => {
      const value = pastMonth
        ? faker.datatype.number({ min: 121, max: 450 })
        : 0;

      productsData[product.name] = value;
    });

    return {
      name: `Semana ${week}`,
      ...productsData,
    };
  });

  return {
    data,
    bars: getBars(products, COLORS.slice(2)),
  };
};

const getLast7DaysData = (products: Product[]) => {
  const LIMIT_DAYS = 7;

  const week = [];

  for (let i = 0; i < LIMIT_DAYS; i++) {
    const date = moment().add(i * -1, 'days');

    const weekDay = date.format('ddd');
    week.push(weekDay);
  }

  const data = week.reverse().map((dayOfWeek) => {
    const productsData: any = {};

    products.forEach((product) => {
      const isWeekend = ['sáb', 'dom'].includes(dayOfWeek);

      productsData[product.name] = isWeekend
        ? 0
        : faker.datatype.number({ min: 121, max: 450 });
    });

    return {
      name: dayOfWeek,
      ...productsData,
    };
  });

  return {
    data,
    bars: getBars(products, COLORS.slice(4)),
  };
};

type ChartState = { data: any[]; bars: any[] };

const Home = withProvider(ProductsProvider)(() => {
  const { ref: anualRef, width: anualWidth } = useRefDimensions({});
  const { ref: monthlyRef, width: monthlyWidth } = useRefDimensions({});
  const { ref: weeklyRef, width: weeklyWidth } = useRefDimensions({});

  const { fetchProducts } = useProductsEffects();
  const { products, isLoading } = useProductsState();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const [year, setYear] = React.useState(moment().get('year'));
  const [month, setMonth] = React.useState(moment().get('month'));

  const [anual, setAnual] = React.useState<ChartState>({
    data: [],
    bars: [],
  });

  const [last7Days, setLast7Days] = React.useState<ChartState>({
    data: [],
    bars: [],
  });

  React.useEffect(() => {
    if (!products.length) {
      return;
    }
    const { data, bars } = getAnualData(year, products);

    setAnual({ data, bars });
  }, [year, products]);

  const [monthly, setMonthly] = React.useState<ChartState>({
    data: [],
    bars: [],
  });

  React.useEffect(() => {
    if (!products.length) {
      return;
    }

    const { data, bars } = getMonthlyData(year, month, products);

    setMonthly({ data, bars });
  }, [year, month, products]);

  React.useEffect(() => {
    if (!products.length) {
      return;
    }

    const result = getLast7DaysData(products);

    setLast7Days(result);
  }, [products]);

  useCheckPermissionPage(['admin', 'manager']);

  return (
    <Container>
      <Head>
        <title>Painel - Digital Production</title>
      </Head>

      <h1 className="mb-5">
        <b>Painel</b>
      </h1>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <strong>Anual</strong>
              <Form.Select
                className="w-25"
                value={year}
                onChange={(e) => setYear(+e.target.value)}
              >
                {[2019, 2020, 2021, 2022].map((y) => {
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </Form.Select>
            </Card.Header>

            <Card.Body ref={anualRef}>
              {isLoading ? (
                <Spinner animation="border" />
              ) : (
                <CharBar
                  width={anualWidth - 50}
                  height={250}
                  data={anual.data}
                  bars={anual.bars}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <strong>Mensal</strong>

              <Form.Select
                className="w-50"
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
              >
                {MONTHS.map((month, idx) => {
                  return (
                    <option key={month} value={idx + 1}>
                      {month}
                    </option>
                  );
                })}
              </Form.Select>
            </Card.Header>

            <Card.Body ref={monthlyRef}>
              {isLoading ? (
                <Spinner animation="border" />
              ) : (
                <CharBar
                  width={monthlyWidth - 50}
                  height={250}
                  data={monthly.data}
                  bars={monthly.bars}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md="6">
          <Card>
            <Card.Header>
              <strong>Últimos 7 dias</strong>
            </Card.Header>

            <Card.Body ref={weeklyRef}>
              {isLoading ? (
                <Spinner animation="border" />
              ) : (
                <CharBar
                  width={weeklyWidth - 50}
                  height={250}
                  data={last7Days.data}
                  bars={last7Days.bars}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

export default Home;
