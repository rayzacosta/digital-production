import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import { AddProcessesToUserModal } from 'src/components/AddProcessesToUserModal';
import withProvider from 'src/hocs/withProvider';
import { useModal } from 'src/hooks/useModal';
import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';
import {
  UsersProvider,
  useUserEffects,
  useUserState,
} from 'src/providers/users.provider';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { Table, TableProps } from 'src/components/Table/Table';
import { toast } from 'react-toastify';
import { useUser } from 'src/hooks/useUser';
import { Icon } from '@iconify/react';
import { ChangePasswordModal } from 'src/components/ChangePasswordModal';
import { UserDetailsModal } from 'src/components/UserDetailsModal';
import Head from 'next/head';

const UsersPage = withProvider(
  UsersProvider,
  ProcessesProvider
)(() => {
  const [isOpen, handleClose, handleOpen] = useModal();
  const [isOpenUserDetails, handleCloseUserDetails, handleOpenUserDetails] =
    useModal();
  const [isOpenChangePass, handleCloseChangePass, handleOpenChangePass] =
    useModal();

  const { users, isLoading, user } = useUserState();
  const { fetchUsers, fetchUserById, addProcessesToUser, updatePassword } =
    useUserEffects();

  const currentUser = useUser();

  const { fetchProcesses } = useProcessesEffects();
  const { processes } = useProcessesState();

  React.useEffect(() => {
    fetchUsers();
    fetchProcesses();
  }, []);

  useCheckPermissionPage(['admin', 'manager']);

  const handleEditProcesses = async (userId: string) => {
    await fetchUserById(userId);

    handleOpen();
  };

  const handleAddProcessesToUser = async (
    user_id: string,
    processes_id: string[]
  ) => {
    try {
      console.log({ user_id, processes_id });
      await addProcessesToUser(user_id, processes_id);

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveNewPass = async (userId: string, newPassword: string) => {
    try {
      await updatePassword(userId, newPassword);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowUserDetails = async (userId: string) => {
    await fetchUserById(userId);

    handleOpenUserDetails();
  };

  const handleDelete = (id: string) => {
    console.log('handleDelete::id::', id);
    toast.info('Função em desenvolvimento');
  };

  const handleEditPassword = async (userId: string) => {
    await fetchUserById(userId);

    handleOpenChangePass();
  };

  const columns: TableProps['columns'] = [
    {
      accessor: 'name',
      Header: 'Nome',
    },
    {
      accessor: 'username',
      Header: 'Usuário',
    },
    {
      accessor: 'id',
      Header: '',
      Cell: ({ value: id, row }) => {
        console.log('row:::row, row', row.original);
        return (
          <div className="d-flex gap-3 justify-content-end">
            {currentUser?.role === 'admin' &&
              (row.original as any).role !== 'admin' && (
                <Button onClick={() => handleEditProcesses(id)} size="sm">
                  Editar Processos
                </Button>
              )}

            <Button onClick={() => handleShowUserDetails(id)} size="sm">
              <Icon icon="bi:eye-fill" />
            </Button>

            {currentUser?.role === 'admin' && (
              <>
                <Link href={`/user/${id}`} passHref>
                  <Button variant="warning" size="sm">
                    <Icon icon="bi:pencil-square" />
                  </Button>
                </Link>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleEditPassword(id)}
                >
                  <Icon icon="bi:key-fill" />
                </Button>
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
        <title>Usuários - Digital Production</title>
      </Head>

      <AddProcessesToUserModal
        user={user}
        isOpen={isOpen}
        processes={processes}
        onClose={handleClose}
        onSave={handleAddProcessesToUser}
        isLoading={isLoading}
      />

      <ChangePasswordModal
        user={user}
        isOpen={isOpenChangePass}
        onClose={handleCloseChangePass}
        onSave={handleSaveNewPass}
        isLoading={isLoading}
      />

      <UserDetailsModal
        user={user as any}
        onClose={handleCloseUserDetails}
        isOpen={isOpenUserDetails}
      />

      <h1 className="fw-bold">Users</h1>

      {currentUser?.role === 'admin' && (
        <div className="w-100 d-flex justify-content-end">
          <Link href="/user" passHref>
            <Button>Novo</Button>
          </Link>
        </div>
      )}

      <div className="mt-4">
        <Table columns={columns} data={users} isLoading={isLoading} />
      </div>
    </div>
  );
});

export default UsersPage;
