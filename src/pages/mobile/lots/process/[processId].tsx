import { Icon } from '@iconify/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'src/components';
import { Backbar } from 'src/components/Backbar';
import withProvider from 'src/hocs/withProvider';
import { useUser } from 'src/hooks/useUser';
import {
  LotProcessesProvider,
  useLotProcessesEffects,
  useLotProcessesState,
} from 'src/providers/lotProcesses.provider';

import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';

const LotsProcess = withProvider(
  LotProcessesProvider,
  ProcessesProvider
)(() => {
  const router = useRouter();
  const processId = router.query.processId as string;
  const { availableLots, isLoading } = useLotProcessesState();
  const { fetchAvailableLots } = useLotProcessesEffects();
  const { fetchProcessById } = useProcessesEffects();
  const { process } = useProcessesState();

  const user = useUser();

  const isCutProcess = process?.order === 1;

  React.useEffect(() => {
    if (processId) {
      fetchAvailableLots(processId);
      fetchProcessById(processId);
    }
  }, [processId]);

  const handleLotDetails = (lotId: string) => {
    toast.info(`Funcionalidade será desenvolvida na próxima versão.`);
  };

  return (
    <div>
      <Head>
        <title>Iniciar {process?.name} - Digital Production</title>
      </Head>
      <Backbar
        title={`Lotes para ${process?.name || ''}`}
        href="/mobile/processes"
      />

      {isLoading && <Spinner animation="border" />}

      {!isLoading && !availableLots.length && (
        <p className="alert alert-info mt-5">
          Não há lotes disponíveis para esse processo
        </p>
      )}

      <div className="d-flex flex-column gap-2">
        {!isLoading &&
          availableLots?.map((available, i) => {
            return (
              <Card
                key={`available-${available.lot_id}-${available.process_id}-${i}`}
                className="p-2"
              >
                <Card.Header>
                  <div className="d-flex align-items-center justify-content-between">
                    <b className="badge badge-info bg-info fs-3">
                      {available?.lot?.identifier}
                    </b>

                    <div className="d-flex justify-content-end">
                      {user?.role === 'operator' && (
                        <Link
                          href={`/mobile/lots/work/${available.lot.id}?process_id=${processId}`}
                          passHref
                        >
                          <Icon
                            className="fs-2 text-primary"
                            icon="bi:play-circle-fill"
                          />
                        </Link>
                      )}

                      {['admin', 'manager'].includes(user?.role || '') && (
                        <Icon
                          onClick={() => handleLotDetails(available.lot.id)}
                          role="button"
                          className="fs-2 text-primary"
                          icon="bi:eye-fill"
                        />
                      )}
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  {isCutProcess ? (
                    'Selecione o lote para corta-lo'
                  ) : (
                    <>
                      <p>
                        <b>Produto:</b> {available.lot.product?.name}
                      </p>
                      <p className="mb-0">
                        <b>Peças restante:</b>{' '}
                        {available.remaining_amount}
                      </p>
                    </>
                  )}
                </Card.Body>
              </Card>
            );
          })}
      </div>
    </div>
  );
});

export default LotsProcess;
