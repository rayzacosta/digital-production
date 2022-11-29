import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { User } from 'src/providers/users.provider';
import { Process } from 'src/providers/processes.provider';

type AddProcessesToUserModalProps = {
  processes: Process[];
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, selectedProcessIds: string[]) => void;
  isLoading?: boolean;
};

export const AddProcessesToUserModal = ({
  onClose,
  onSave,
  isOpen,
  user,
  processes,
  isLoading,
}: AddProcessesToUserModalProps) => {
  const [selectedProcessIds, setSelectedProcessIds] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    if (user?.processes) {
      const ids = user.processes.map(({ id }) => id);

      setSelectedProcessIds(ids);
    } else {
      setSelectedProcessIds([]);
    }
  }, [user]);

  const handleChange = (id: string, value: boolean) => {
    if (value) {
      setSelectedProcessIds((prev) => [...prev, id]);
    } else {
      setSelectedProcessIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleSave = () => {
    if (!user) {
      return alert('Não há um produto selecionado');
    }

    onSave(user.id, selectedProcessIds);
  };

  return (
    <Modal show={isOpen}>
      <Modal.Header onHide={onClose} closeButton>
        Usuário: {user?.name}
      </Modal.Header>

      <Modal.Body>
        {processes.map((process) => {
          return (
            <Form.Check
              label={process.name}
              key={process.id}
              type="checkbox"
              onChange={(e) => handleChange(process.id, e.target.checked)}
              checked={!!selectedProcessIds.find((item) => item === process.id)}
            />
          );
        })}
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
