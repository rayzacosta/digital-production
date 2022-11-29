import React from 'react';
import Link from 'next/link';

import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import withProvider from 'src/hocs/withProvider';
import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';
import { Backbar } from 'src/components/Backbar';
import { Icon } from '@iconify/react';
import Head from 'next/head';

const Processes = withProvider(ProcessesProvider)(() => {
  const { processes, isLoading } = useProcessesState();
  const { fetchAvailableProcesses } = useProcessesEffects();

  React.useEffect(() => {
    fetchAvailableProcesses();
  }, []);

  return (
    <div>
      <Head>
        <title>Selecione um processo - Digital Production</title>
      </Head>

      <Backbar title="Selecione seu processo" href="/mobile" />

      {!processes?.length && !isLoading && (
        <p>Não existe nenhum processo cadastrado para seu usuário</p>
      )}

      {isLoading && <Spinner animation="border" />}

      <div className="d-flex flex-column gap-3">
        <Container>
          <Row>
            {processes.map(({ id, name, icon }) => {
              return (
                <Col xs="6" md="4" lg="3" key={JSON.stringify({ id, name })}>
                  <Link href={`/mobile/lots/process/${id}`} passHref>
                    <Card role="button" className="bg-secondary">
                      <Card.Body>
                        <div className="d-flex flex-column align-items-center gap-3 text-white">
                          <Icon className="fs-1" icon={icon} />
                          {name}
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
});

export default Processes;
