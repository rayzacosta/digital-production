import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { User } from 'src/providers/users.provider';
import { Process } from 'src/providers/processes.provider';
import { toast } from 'react-toastify';

type ChangePasswordModalProps = {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, newPassword: string) => void;
  isLoading?: boolean;
};

export const ChangePasswordModal = ({
  onClose,
  onSave,
  isOpen,
  user,
  isLoading,
}: ChangePasswordModalProps) => {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSave = () => {
    if (!user) {
      return alert('Não há um usuário selecionado');
    }

    if (!password || !confirmPassword) {
      return toast.error(
        'Os campos Nova Senha e Confirmar Nova Senha não podem ser vazios'
      );
    }

    if (password !== confirmPassword) {
      return toast.error(
        'Os campos Nova Senha e Confirmar Nova Senha devem ser iguais'
      );
    }

    if (
      password?.split('')?.length < 4 ||
      confirmPassword?.split('')?.length < 4
    ) {
      return toast.error(
        'Os campos Nova Senha e Confirmar Nova Senha devem conter pelo menos 4 caracteres!'
      );
    }

    onSave(user.id, password);
  };

  return (
    <Modal show={isOpen}>
      <Modal.Header onHide={onClose} closeButton>
        Usuário: {user?.name}
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nova Senha</Form.Label>
            <Form.Control
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Confirmar Nova Senha</Form.Label>
            <Form.Control
              value={confirmPassword}
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Form>

        <ul className="alert alert-info mt-4 mb-0">
          <li>As senhas precisão ser iguais</li>
          <li>As senhas precisão ter pelo menos 4 caracteres</li>
        </ul>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Spinner animation="border" size="sm" />}
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
