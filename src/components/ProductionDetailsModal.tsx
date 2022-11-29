import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { Table } from './Table/Table';

type ProductionDetailsModalProps = {
  productions?: any[];
  isOpen: boolean;
  onClose: () => void;
};

export const ProductionDetailsModal = ({
  onClose,
  isOpen,
  productions = [],
}: ProductionDetailsModalProps) => {
  const columns = [
    { accessor: 'lot.identifier', Header: 'Lote' },
    { accessor: 'lot.product.name', Header: 'Produto' },
    { accessor: 'process.name', Header: 'Processo' },
    { accessor: 'amount', Header: 'Produção' },
  ];

  return (
    <Modal size="xl" show={isOpen}>
      <Modal.Header onHide={onClose} closeButton>
        <h1 className="mb-0">Produção</h1>
      </Modal.Header>

      <Modal.Body>
        <Table columns={columns} data={productions} />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
};
