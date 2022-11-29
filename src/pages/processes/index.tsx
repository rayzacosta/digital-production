import { Icon } from '@iconify/react';
import Head from 'next/head';
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'src/components';
import { Table, TableProps } from 'src/components/Table/Table';
import { formatCurrency } from 'src/helpers/currency';
import withProvider from 'src/hocs/withProvider';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { useUser } from 'src/hooks/useUser';
import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';

const Processes = withProvider(ProcessesProvider)(() => {
  const { processes, isLoading } = useProcessesState();
  const { fetchProcesses } = useProcessesEffects();

  const user = useUser();

  useCheckPermissionPage(['admin', 'manager']);

  React.useEffect(() => {
    fetchProcesses();
  }, []);

  const columns: TableProps['columns'] = [
    {
      accessor: 'name',
      Header: 'Nome',
    },
    {
      accessor: 'goal',
      Header: 'Meta',
    },
    {
      accessor: 'value_per_extra_piece',
      Header: 'Valor por Peça Extra',
      Cell: ({ value }) => <>{formatCurrency(value)}</>,
    },
    {
      accessor: 'icon',
      Header: 'Ícone do Processo',
      Cell: ({ value }) => {
        if (!value) {
          return null;
        }

        return (
          <div className="d-flex align-items-center gap-3">
            <Icon className="text-primary fs-1" icon={value} />
            <small className="text-muted">{value}</small>

            <Icon
              role="button"
              className="text-muted"
              icon="lucide:clipboard-copy"
              onClick={() => {
                if (!!navigator?.clipboard?.writeText) {
                  navigator.clipboard.writeText(value);
                }
              }}
            />
          </div>
        );
      },
    },
    {
      accessor: 'id',
      Header: '',
      Cell: ({ value: id }) => {
        if (user?.role !== 'admin') {
          return null;
        }

        return (
          <div className="d-flex gap-3 justify-content-end">
            <Link href={`/process/${id}`} passHref>
              <Button variant="warning" size="sm">
                <Icon icon="bi:pencil-square" />
              </Button>
            </Link>

            <Button
              // onClick={() => handleDelete(id)}
              variant="danger"
              size="sm"
            >
              <Icon icon="bi:trash-fill" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="pt-5">
      <Head>
        <title>Processos - Digital Production</title>
      </Head>

      <h1 className="fw-bold">Processos</h1>

      {user?.role === 'admin' && (
        <div className="w-100 d-flex justify-content-end">
          <Link href="/process" passHref>
            <Button>Novo</Button>
          </Link>
        </div>
      )}

      <div className="mt-4">
        <Table data={processes} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  );
});

export default Processes;
