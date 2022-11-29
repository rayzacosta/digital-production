import moment from 'moment';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { LotDTO } from 'src/persistence/lot.dao';
import { LotBadge } from './LotBadge';

type LotDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lot?: LotDTO;
};

const FORMAT_DATE = 'DD/MM/YYYY HH:mm:ss';

export const LotDetailsModal = ({
  onClose,
  lot,
  isOpen,
}: LotDetailsModalProps) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <LotBadge>{lot?.identifier}</LotBadge>
      </Modal.Header>

      <Modal.Body>
        <div>
          {/* <p>Número do lote: {lot?.identifier}</p> */}

          <p>
            <b>Produto:</b> {lot?.product?.name}
          </p>
          <p>
            <b>Quantidade de produtos cortados:</b> {lot?.amount}
          </p>

          <p>
            <b>Data de corte:</b>{' '}
            {!!lot?.cut_date && moment(lot.cut_date).format(FORMAT_DATE)}
          </p>
          <p>
            <b>Data de finalização:</b>{' '}
            {!!lot?.completion_date
              ? moment(lot.completion_date).format(FORMAT_DATE)
              : 'O lote ainda não foi finalizado'}
          </p>

          <p className="mb-0">
            <b>Cortado:</b> {lot?.cut ? 'Sim' : 'Não'}
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};
