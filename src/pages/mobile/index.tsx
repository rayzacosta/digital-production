import React from 'react';
import { Button, Card, Col, Image, Row } from 'react-bootstrap';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Head from 'next/head';

type CardButtonProps = {
  title: string;
  icon: string;
  href: string;
};

const CardButton = ({ title, icon, href }: CardButtonProps) => {
  return (
    <Link href={href} passHref>
      <Card role="button" className="bg-primary w-100">
        <Card.Body>
          <div className="d-flex flex-column align-items-center gap-3">
            <Icon className="fs-1 text-white" icon={icon} />

            <strong className="text-white">{title}</strong>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

const MobileHome = () => {
  return (
    <div style={{ minHeight: '50vh' }} className="container d-flex flex-column">
      <Head>
        <title>Menu Principal - Digital Production</title>
      </Head>
      <h1>
        <b>Área do operador</b>
      </h1>

      <Image
        src="https://res.cloudinary.com/dpmunc2ma/image/upload/v1669687701/digital-production/assets/images/machine-1_vq6e1o.png"
        alt="Ilustração máquina de costura"
        height={200}
        width="auto"
        className="align-self-center mb-5 mt-5 opacity-75"
      />

      <Row className="mt-auto">
        <Col xs="6">
          <CardButton
            href="/mobile/processes"
            title="Iniciar"
            icon="mdi:rocket-launch-outline"
          />
        </Col>

        <Col xs="6">
          <CardButton
            href="/mobile/in-progress"
            title="Em progresso"
            icon="mdi:stopwatch-start-outline"
          />
        </Col>
      </Row>
    </div>
  );
};

export default MobileHome;
