import { useRouter } from 'next/router';
import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'src/components';
import { Table, TableProps } from 'src/components/Table/Table';
import withProvider from 'src/hocs/withProvider';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import cx from 'classnames';
import {
  LotsProvider,
  useLotsEffects,
  useLotsState,
} from 'src/providers/lots.provider';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { LotDetailsModal } from 'src/components/LotDetailsModal';
import { useModal } from 'src/hooks/useModal';
import { useUser } from 'src/hooks/useUser';
import Head from 'next/head';

moment.locale('pt-br');

const Lots = withProvider(LotsProvider)(() => {
  const { lots, isLoading, lot } = useLotsState();
  const { fetchLots, fetchLotById, deleteLot } = useLotsEffects();

  const [isOpen, handleClose, handleOpen] = useModal();

  const user = useUser();

  const router = useRouter();

  useCheckPermissionPage(['admin', 'manager']);

  React.useEffect(() => {
    fetchLots();
  }, []);

  const handleLotDetails = async (id: string) => {
    await fetchLotById(id);

    handleOpen();
  };

  const columns: TableProps['columns'] = [
    {
      accessor: 'identifier',
      Header: 'Numero do Lote',
    },
    {
      accessor: 'created_at',
      Header: 'Gerado',
      Cell: ({ value }) => <>{moment(value).format('DD/MM/YYYY hh:mm:ss')}</>,
    },
    {
      accessor: 'cut',
      Header: 'Cortado',
      Cell: ({ value: cut }) => {
        return (
          <Icon
            icon={cut ? 'bi:check-square-fill' : 'bi:check-square'}
            className={cx({ 'text-success': cut })}
          />
        );
      },
    },
    {
      accessor: 'product.name',
      Header: 'Produto',
    },
    {
      accessor: 'id',
      Header: '',
      Cell: ({ value: id, row }) => {
        const hadCut = !!(row.original as any).cut;
        return (
          <div className="d-flex justify-content-end gap-3">
            {hadCut ? (
              <Button
                title="Visualizar"
                onClick={() => handleLotDetails(id)}
                size="sm"
              >
                <Icon icon="bi:eye-fill" />
              </Button>
            ) : (
              <Link href={`/lot/${id}`} passHref>
                <Button title="Editar" size="sm">
                  <Icon icon="bi:pencil-square" />
                </Button>
              </Link>
            )}

            {user?.role === 'admin' && !hadCut && (
              <Button
                title="Excluir"
                onClick={() => deleteLot(id)}
                size="sm"
                variant="danger"
              >
                <Icon icon="bi:trash-fill" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="pt-5">
      <Head>
        <title>Lotes - Digital Production</title>
      </Head>
      <LotDetailsModal isOpen={isOpen} onClose={handleClose} lot={lot as any} />
      <h1 className="fw-bold">Lotes</h1>

      {user?.role === 'admin' && (
        <div className="w-100 d-flex justify-content-end">
          <Link href="/lot" passHref>
            <Button className="ms-auto">Novo</Button>
          </Link>
        </div>
      )}

      <div className="mt-4">
        <Table columns={columns} data={lots} isLoading={isLoading} />
      </div>
    </div>
  );
});

export default Lots;
