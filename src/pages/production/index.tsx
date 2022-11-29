import React from 'react';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import withProvider from 'src/hocs/withProvider';
import {
  UsersProvider,
  useUserEffects,
  useUserState,
} from 'src/providers/users.provider';

import { DateRangePicker } from 'react-dates';
import { DateRange, DateValues } from 'src/components/DateRange/DateRange';
import moment, { Moment } from 'moment';
import {
  ProductionsProvider,
  useProductionsEffects,
  useProductionsState,
} from 'src/providers/productions.provider';
import { toast } from 'react-toastify';
import { Table, TableProps } from 'src/components/Table/Table';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import Head from 'next/head';

const Production = withProvider(
  UsersProvider,
  ProductionsProvider
)(() => {
  const [period, setPeriod] = React.useState<DateValues>({
    endDate: null,
    startDate: null,
  });
  const [selectedUser, setSelectedUser] = React.useState('');

  const { users } = useUserState();
  const { fetchUsers } = useUserEffects();
  const { productions, isLoading } = useProductionsState();
  const { fetchProductionsFiltered } = useProductionsEffects();

  const handleFetch = () => {
    if (!period.endDate || !period.startDate || !selectedUser) {
      toast.info('Preencha todos os campos para fazer a consulta!');
      return;
    }

    fetchProductionsFiltered(selectedUser, period.startDate, period.endDate);
  };

  const columns: TableProps['columns'] = [
    { accessor: 'lot.identifier', Header: 'Lote' },
    { accessor: 'lot.product.name', Header: 'Produto' },
    { accessor: 'process.name', Header: 'Processo' },
    { accessor: 'amount', Header: 'Produção' },
    {
      accessor: 'duration',
      Header: 'Duração',
    },
  ];

  useCheckPermissionPage(['admin', 'manager']);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="pt-5">
      <Head>
        <title>Produção - Digital Production</title>
      </Head>

      <h1 className="mb-5">
        <b>Registro de Produção</b>
      </h1>

      <Row>
        <Col sm="12" md="6">
          <Form.Group className="">
            <Form.Label>Usuário</Form.Label>

            <Form.Select onChange={(e) => setSelectedUser(e.target.value)}>
              <option>Selecione um Usuário</option>
              {users
                ?.filter((user) => user.role === 'operator')
                .map((user) => {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col sm="8" md="4">
          <DateRange value={period} onChange={setPeriod} label="Período" />
        </Col>
        <Col
          sm="4"
          md="2"
          className="d-flex align-items-end justify-content-end pb-2"
        >
          <Button onClick={handleFetch}>
            {isLoading && <Spinner animation="border" size="sm" />}
            Buscar
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Table data={productions} columns={columns} isLoading={isLoading} />
      </Row>
    </Container>
  );
});

export default Production;
