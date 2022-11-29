import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Backbar } from 'src/components/Backbar';
import withProvider from 'src/hocs/withProvider';
import {
  ProductionsProvider,
  useProductionsEffects,
  useProductionsState,
} from 'src/providers/productions.provider';

const InProgress = withProvider(ProductionsProvider)(() => {
  const { fetchProductionsInProgress } = useProductionsEffects();
  const { productions, isLoading } = useProductionsState();

  React.useEffect(() => {
    fetchProductionsInProgress();
  }, []);

  return (
    <div>
      <Head>
        <title>Produção em progresso - Digital Production</title>
      </Head>
      <Backbar title="Em execução" href="/mobile" />

      <div className="d-flex flex-column gap-3">
        {!productions?.length && !isLoading && (
          <p className="alert alert-info mt-5">
            Não existe nenhum processo em execução no momento.{' '}
            <Link href="/mobile/processes" passHref>
              <a className="alert-link">
                Vá até a seleção de processos para iniciar
              </a>
            </Link>
          </p>
        )}

        <Container>
          <Row>
            {productions?.map?.((item) => {
              return (
                <Col md="4" key={item.id}>
                  <Link href={`/mobile/finish/${item.id}`} passHref>
                    <Card role="button" className="p-2">
                      <Card.Header>
                        <b>Lote</b>{' '}
                        <span className="badge badge-primary bg-info fs-3">
                          {item.lot.identifier}
                        </span>
                      </Card.Header>
                      <Card.Body>
                        <p>
                          <b>Colaborador:</b> {item.user.name}
                        </p>
                        <p>
                          <b>Processo:</b> {item.process.name}
                        </p>
                        <p>
                          <b>Produto:</b> {item.lot.product?.name}
                        </p>
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

export default InProgress;
