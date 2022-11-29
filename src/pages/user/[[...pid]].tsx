import React from 'react';
import { Link } from 'src/components';
import withProvider from 'src/hocs/withProvider';
import {
  UsersProvider,
  useUserEffects,
  useUserState,
} from 'src/providers/users.provider';
import { useRouter } from 'next/router';
import { Button, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import cx from 'classnames';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import Head from 'next/head';

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'manager', label: 'Gerente' },
  { value: 'operator', label: 'Operador' },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  username: Yup.string().required('O Nome de usuário é obrigatório'),
  role: Yup.string().required('A permissão é obrigatório'),
});

type UserForm = {
  name: string;
  username: string;
  role: string;
};

const User = withProvider(UsersProvider)(() => {
  const { user, isLoading } = useUserState();
  const { fetchUserById, createUser, updateUser } = useUserEffects();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<UserForm>({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  const [id] = (router.query.pid as string[]) || [];

  useCheckPermissionPage(['admin', 'manager']);

  const onSubmit = async (data: UserForm) => {
    if (user?.id) {
      await updateUser(data);
    } else {
      await createUser(data);
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id]);

  React.useEffect(() => {
    if (!!user && !isLoading) {
      setValue('name', user.name);
      setValue('role', user.role);
      setValue('username', user.username);
    }
  }, [user, isLoading]);

  console.log('user::', user);

  return (
    <Container className="pt-5">
      <Head>
        <title>
          {id ? 'Editar' : 'Cadastrar'} Usuário - Digital Production
        </title>
      </Head>

      <h1 className="mb-5">
        <b>{id ? 'Editar' : 'Cadastrar'} Usuário</b>
      </h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome"
            {...register('name')}
            className={cx({ 'is-invalid': errors?.name })}
          />
          <div className="invalid-feedback">{errors?.name?.message}</div>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Nome de Usuário</Form.Label>
          <Form.Control
            type="text"
            placeholder="Insira um nome de usuário"
            {...register('username')}
            className={cx({ 'is-invalid': errors?.username })}
          />
          <div className="invalid-feedback">{errors?.username?.message}</div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Permissão</Form.Label>

          <Form.Select
            {...register('role')}
            className={cx({ 'is-invalid': errors?.role })}
          >
            <option>Selecione uma permissão</option>
            {ROLES.map((role) => {
              return (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-end gap-4">
          <Link href="/users" passHref>
            <Button variant="outlined" type="button">
              Voltar
            </Button>
          </Link>
          <Button type="submit">Salvar</Button>
        </div>
      </Form>
    </Container>
  );
});

export default User;
