import { Icon } from '@iconify/react';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Card, Form, FormSelect, Spinner } from 'react-bootstrap';
import { Link } from 'src/components';
import { Backbar } from 'src/components/Backbar';
import { Timer } from 'src/components/Timer/Timer';
import withProvider from 'src/hocs/withProvider';
import { useStorageState } from 'src/hooks/useStorageState';
import { useUser } from 'src/hooks/useUser';
import {
  LotProcessesProvider,
  useLotProcessesEffects,
  useLotProcessesState,
} from 'src/providers/lotProcesses.provider';
import {
  LotsProvider,
  useLotsEffects,
  useLotsState,
} from 'src/providers/lots.provider';
import {
  ProductionsProvider,
  useProductionsEffects,
} from 'src/providers/productions.provider';
import {
  ProductsProvider,
  useProductsEffects,
  useProductsState,
} from 'src/providers/products.provider';

const LotsWork = withProvider(
  LotProcessesProvider,
  ProductsProvider,
  ProductionsProvider
)(() => {
  const router = useRouter();
  const lot_id = router.query.lot_id as string;
  const process_id = router.query.process_id as string;
  const [selectedProduct, setSelectedProduct] = React.useState<
    string | undefined
  >();

  const currentUser = useUser();

  const { fetchProducts } = useProductsEffects();
  const { products } = useProductsState();

  const { lotProcess, isLoading } = useLotProcessesState();
  const { fetchLotProcessById } = useLotProcessesEffects();

  const { registerStartProduction } = useProductionsEffects();

  const isCutProcess = !!lotProcess?.isCutProcess;

  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    if (lot_id && process_id) {
      fetchLotProcessById(lot_id, process_id);
    }
  }, [lot_id, process_id]);

  const handleStart = async () => {
    if (isCutProcess && !selectedProduct) {
      return alert('É necessário a seleção de um produto');
    }

    await registerStartProduction(lot_id, process_id, selectedProduct);
  };

  return (
    <div className="d-flex flex-column">
      <Head>
        <title>
          Iniciar produção no lote {lotProcess?.lot?.identifier} - Digital
          Production
        </title>
      </Head>

      <Backbar
        title={
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="mb-0 fw-bold">Iniciar produção </h2>
            <b className="badge badge-info bg-info ms-auto fs-3 me-2">
              {lotProcess?.lot?.identifier}
            </b>
          </div>
        }
      />

      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <div className="d-flex flex-column gap-3">
          <Form>
            {lotProcess?.isCutProcess ? (
              <Form.Group className="mb-4">
                <Form.Label>Produto</Form.Label>

                <Form.Select
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option>Selecione um produto</option>
                  {products?.map((user) => {
                    return (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            ) : (
              <>
                {!isLoading && (
                  <Card>
                    <Card.Header>
                      <b>{lotProcess?.lot?.product?.name}</b>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <b>Total:</b> {lotProcess?.amount}
                      </p>

                      <p className="mb-0">
                        <b>Restante:</b> {lotProcess?.remaining_amount}
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </Form>

          {currentUser?.role === 'operator' && (
            <Button
              size="lg"
              className="align-self-center fw-bold px-5"
              onClick={handleStart}
            >
              {isLoading && <Spinner size="sm" animation="border" />}
              Iniciar

              <Icon className='ms-3 fs-2' icon="mdi:rocket-launch-outline"  />
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

export default LotsWork;
