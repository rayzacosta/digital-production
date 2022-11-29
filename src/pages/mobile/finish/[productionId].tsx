import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { Backbar } from 'src/components/Backbar';
import withProvider from 'src/hocs/withProvider';
import { useUser } from 'src/hooks/useUser';
import {
  ProductionsProvider,
  useProductionsEffects,
  useProductionsState,
} from 'src/providers/productions.provider';

const FinishProduction = withProvider(ProductionsProvider)(() => {
  const user = useUser();

  const { fetchProductionById, registerStopProduction } =
    useProductionsEffects();
  const { isLoading, production } = useProductionsState();

  const [amount, setAmount] = React.useState<number>(0);

  const router = useRouter();

  const productionId = router.query.productionId as string;

  const handleRegister = () => {
    registerStopProduction(productionId, amount);
  };

  React.useEffect(() => {
    if (productionId) {
      fetchProductionById(productionId);
    }
  }, [productionId]);

  return (
    <div className="d-flex flex-column">
      <Head>
        <title>Registrar produção - Digital Production</title>
      </Head>
      <Backbar title="Finalizar produção" href="/mobile/in-progress" />

      {isLoading && <Spinner animation="border" />}

      <Card>
        <Card.Header>
          <b>Lote</b>{' '}
          <span className="badge badge-primary bg-info fs-3">
            {production?.lot?.identifier}
          </span>
          {/* Lote: {production?.lot?.identifier} */}
        </Card.Header>
        <Card.Body>
          <p>
            <b>Produto:</b> {production?.lot?.product?.name}
          </p>
          <p>
            <b>Data de Início:</b>{' '}
            {moment(production?.start_date).format('DD/MM/YYYY hh:mm:ss')}
          </p>
          <p>
            <b>Processo:</b> {production?.process?.name}
          </p>
          <p>
            <b>Usuário:</b> {production?.user?.name}
          </p>

          {production?.remaining_amount && (
            <p>
              <b>Restante:</b> {production?.remaining_amount}
            </p>
          )}
        </Card.Body>
      </Card>

      {user?.role === 'operator' && (
        <>
          <Form.Control
            type="number"
            onChange={(e) => setAmount(+e.target.value)}
            defaultValue={0}
          />

          <Button
            size="lg"
            disabled={!amount}
            onClick={handleRegister}
            className="mt-4 fw-bold"
          >
            {isLoading && <Spinner size="sm" animation="border" />}
            Registrar Processo
          </Button>
        </>
      )}
    </div>
  );
});

export default FinishProduction;
