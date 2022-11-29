import React from 'react';
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
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
import {
  ExtractProvider,
  useExtractEffects,
  useExtractState,
} from 'src/providers/extract.provider';
import { useModal } from 'src/hooks/useModal';
import { ProductionDetailsModal } from 'src/components/ProductionDetailsModal';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { formatCurrency } from 'src/helpers/currency';
import Head from 'next/head';

const Production = withProvider(
  UsersProvider,
  ExtractProvider
)(() => {
  const [period, setPeriod] = React.useState<DateValues>({
    endDate: null,
    startDate: null,
  });
  const [selectedUser, setSelectedUser] = React.useState('');
  const [isOpen, handleClose, handleOpen] = useModal();
  const [selectedProductions, setSelectedProductions] = React.useState<any[]>(
    []
  );

  const { users } = useUserState();
  const { fetchUsers } = useUserEffects();
  const { extract, isLoading } = useExtractState();
  const { fetchExtract } = useExtractEffects();

  const handleFetch = () => {
    if (!period.endDate || !period.startDate || !selectedUser) {
      toast.info('Preencha todos os campos para fazer a consulta!');
      return;
    }

    fetchExtract(selectedUser, period.startDate, period.endDate);
  };

  const handleDetails = (productions: any[]) => {
    setSelectedProductions(productions);
    handleOpen();
  };

  const columns: TableProps['columns'] = [
    { accessor: 'process', Header: 'Processo' },
    { accessor: 'date', Header: 'Data' },
    { accessor: 'goal', Header: 'Peças Extra' },
    {
      accessor: 'valuePerExtraPiece',
      Header: 'R$',
      Cell: ({ value }) => <>{formatCurrency(value)}</>,
    },
    { accessor: 'requiredGoal', Header: 'Meta' },
    { accessor: 'amount', Header: 'Total' },
    {
      accessor: 'valueToPay',
      Header: 'Total R$',
      Cell: ({ value }) => <>{formatCurrency(value)}</>,
    },
  ];

  useCheckPermissionPage(['admin']);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="pt-5">
      <Head>
        <title>Relatório por Usuário/Período - Digital Production</title>
      </Head>

      <ProductionDetailsModal
        isOpen={isOpen}
        onClose={handleClose}
        productions={selectedProductions}
      />

      <h1 className="mb-5">
        <b>Relatório por Usuário/Período</b>
      </h1>

      <Row>
        <Col sm="12" md="6">
          <Form.Group className="">
            <Form.Label>Usuário</Form.Label>

            <Form.Select onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Selecione um Usuário</option>
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

      {!!extract && (
        <Row className="mt-4">
          <Col>
            <h3>
              <b>Peças extra:</b> {extract.totalExtraPieces}
            </h3>
            <h3>
              <b>Valor a pagar:</b> <>{formatCurrency(extract.valueToPay)}</>
            </h3>
          </Col>
        </Row>
      )}

      {extract?.processes && (
        <Row className="mt-3">
          <Col>
            <Accordion>
              <Accordion.Header>
                <h3 className="mb-0">
                  <b>Detalhes</b>
                </h3>
              </Accordion.Header>

              <Accordion.Body>
                <Table
                  data={extract?.processes || []}
                  columns={columns}
                  isLoading={isLoading}
                  handleRowClick={(row) => handleDetails(row.productions)}
                />
              </Accordion.Body>
            </Accordion>
          </Col>
        </Row>
      )}
    </Container>
  );
});

export default Production;
