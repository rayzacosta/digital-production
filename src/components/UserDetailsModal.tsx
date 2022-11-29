import moment from 'moment';
import React from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { LotDTO } from 'src/persistence/lot.dao';
import { User } from 'src/providers/users.provider';
import { LabelAndValue } from './LabelAndValue';
import cx from 'classnames';

type UserDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User | any;
};

const FORMAT_DATE = 'DD/MM/YYYY hh:mm:ss';

const USER_ROLE_DESCRIPTION: any = {
  operator: 'Operador',
  admin: 'Administrador',
  manager: 'Gerente',
};

export const UserDetailsModal = ({
  onClose,
  user,
  isOpen,
}: UserDetailsModalProps) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>{user?.name}</Modal.Header>

      <Modal.Body>
        <div>
          {!!user && (
            <>
              <LabelAndValue label="Usuário" value={user.username} />
              <LabelAndValue
                label="Criado em"
                value={moment(user.created_at).format(FORMAT_DATE)}
              />
              <LabelAndValue
                label="Permissão"
                value={USER_ROLE_DESCRIPTION[user.role]}
              />

              {!!user.processes?.length && (
                <div>
                  <strong>Processos relacionados</strong>
                  <Container>
                    <Row className="px-4">
                      <Col>Nome</Col>
                      <Col>Meta</Col>
                      <Col>Valor por peça</Col>
                    </Row>
                    {user.processes.map(
                      (item: any, idx: number, list: any[]) => {
                        const isLast = list.length - 1 === idx;
                        return (
                          <Card
                            className={cx({ 'mb-0': isLast, 'mb-2': !isLast })}
                            key={item.id}
                          >
                            <Card.Body className="py-2">
                              <Row>
                                <Col>{item.name}</Col>
                                <Col>{item.goal}</Col>
                                <Col>{item.value_per_extra_piece}</Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        );
                      }
                    )}
                  </Container>
                </div>
              )}
            </>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};
