import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { Product } from 'src/providers/products.provider';
import { Process } from 'src/providers/processes.provider';
import process from 'src/pages/api/process';

type AddProcessesToProductModalProps = {
  processes: Process[];
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, selectedProcessIds: string[]) => void;
  isLoading?: boolean;
  edit?: boolean;
};

export const AddProcessesToProductModal = ({
  onClose,
  onSave,
  isOpen,
  product,
  processes,
  isLoading,
  edit,
}: AddProcessesToProductModalProps) => {
  const [selectedProcessIds, setSelectedProcessIds] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    if (product?.processes) {
      const ids = product.processes.map(({ id }) => id);

      setSelectedProcessIds(ids);
    } else {
      setSelectedProcessIds([]);
    }
  }, [product]);

  const handleChange = (id: string, value: boolean) => {
    if (value) {
      setSelectedProcessIds((prev) => [...prev, id]);
    } else {
      setSelectedProcessIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleSave = () => {
    if (!product) {
      return alert('Não há um produto selecionado');
    }

    onSave(product.id, selectedProcessIds);
  };

  return (
    <Modal show={isOpen}>
      <Modal.Header onHide={onClose} closeButton>
        Produto: {product?.name}
      </Modal.Header>

      <Modal.Body>
        {processes.map((process) => {
          return (
            <Form.Check
              label={process.name}
              key={process.id}
              disabled={!edit || process.order === 1}
              type="checkbox"
              onChange={(e) => handleChange(process.id, e.target.checked)}
              checked={!!selectedProcessIds.find((item) => item === process.id)}
            />
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outlined" onClick={onClose}>
          Fechar
        </Button>
        {edit && (
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Spinner animation="border" size="sm" />}
            Salvar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
