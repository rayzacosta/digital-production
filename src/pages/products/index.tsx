import { Icon } from '@iconify/react';
import Head from 'next/head';
import React from 'react';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'src/components';
import { AddProcessesToProductModal } from 'src/components/AddProcessesToProductModal';
import { Table, TableProps } from 'src/components/Table/Table';
import { formatCurrency } from 'src/helpers/currency';
import withProvider from 'src/hocs/withProvider';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { useModal } from 'src/hooks/useModal';
import { useUser } from 'src/hooks/useUser';
import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';
import {
  Product,
  ProductsProvider,
  useProductsEffects,
  useProductsState,
} from 'src/providers/products.provider';

const Products = withProvider(
  ProductsProvider,
  ProcessesProvider
)(() => {
  const { products, isLoading, product } = useProductsState();
  const {
    fetchProducts,
    addProcessesToProduct,
    fetchProductById,
    deleteProduct,
  } = useProductsEffects();
  const [isOpen, handleClose, handleOpen] = useModal();

  const user = useUser();

  const { fetchProcesses } = useProcessesEffects();
  const { processes } = useProcessesState();

  React.useEffect(() => {
    fetchProducts();
    fetchProcesses();
  }, []);

  useCheckPermissionPage(['admin', 'manager']);

  const handleSelectProduct = async (productId: string) => {
    await fetchProductById(productId);

    handleOpen();
  };

  const handleAddProcessesToProduct = async (
    product_id: string,
    processes_id: string[]
  ) => {
    try {
      await addProcessesToProduct(product_id, processes_id);

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    // console.log('handleDelete::id::', id);
    // toast.info('Função em desenvolvimento');
  };

  const columns: TableProps['columns'] = [
    {
      accessor: 'name',
      Header: 'Nome',
    },
    {
      accessor: 'cost_price',
      Header: 'Preço de Custo',
      Cell: ({ value }) => <>{formatCurrency(value)}</>,
    },
    {
      accessor: 'sale_price',
      Header: 'Preço de Venda',
      Cell: ({ value }) => <>{formatCurrency(value)}</>,
    },
    {
      accessor: 'id',
      Header: '',
      Cell: ({ value: id }) => {
        // console.log('row:::row, row', id);
        return (
          <div className="d-flex gap-3 justify-content-end">
            <Button onClick={() => handleSelectProduct(id)} size="sm">
              {user?.role === 'admin'
                ? 'Editar Processos'
                : 'Visualizar Processos'}
            </Button>

            {user?.role === 'admin' && (
              <>
                <Link href={`/product/${id}`} passHref>
                  <Button variant="warning" size="sm">
                    <Icon icon="bi:pencil-square" />
                  </Button>
                </Link>

                <Button
                  onClick={() => handleDelete(id)}
                  variant="danger"
                  size="sm"
                >
                  <Icon icon="bi:trash-fill" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="pt-5">
      <Head>
        <title>Produtos - Digital Production</title>
      </Head>

      <AddProcessesToProductModal
        product={product}
        processes={processes}
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleAddProcessesToProduct}
        isLoading={isLoading}
        edit={user?.role === 'admin'}
      />
      <h1 className="mb-5">
        <b>Produtos</b>
      </h1>

      {user?.role === 'admin' && (
        <div className="w-100 d-flex justify-content-end">
          <Link href="/product" passHref>
            <Button>Novo</Button>
          </Link>
        </div>
      )}

      <div className="mt-4">
        <Table data={products} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  );
});

export default Products;
