import React from 'react';
import { Link } from 'src/components';
import withProvider from 'src/hocs/withProvider';
import {
  LotsProvider,
  useLotsEffects,
  useLotsState,
} from 'src/providers/lots.provider';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Head from 'next/head';
import cx from 'classnames';
import {
  ProductsProvider,
  useProductsEffects,
  useProductsState,
} from 'src/providers/products.provider';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { useUser } from 'src/hooks/useUser';

const validationSchema = Yup.object().shape({
  identifier: Yup.string().required('O campo numero do lote é obrigatório'),
});

type LotForm = {
  identifier: string;
};

const Lot = withProvider(
  LotsProvider,
  ProductsProvider
)(() => {
  const { lot, isLoading } = useLotsState();
  const { fetchLotById, createLot, updateLot } = useLotsEffects();

  const user = useUser();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<LotForm>({
    resolver: yupResolver(validationSchema),
  });

  useCheckPermissionPage(['admin', 'manager']);

  const router = useRouter();

  const [id] = (router.query.pid as string[]) || [];

  const onSubmit = async (data: LotForm) => {
    if (lot?.id) {
      await updateLot(data);
    } else {
      await createLot(data);
    }
  };

  React.useEffect(() => {
    if (!lot && id && !isLoading) {
      fetchLotById(id);
    }

    if (!!lot && !isLoading) {
      setValue('identifier', lot.identifier);
    }
  }, [id, isLoading, lot]);

  console.log('lot::', lot);

  return (
    <div className="pt-5">
      <Head>
        <title>Lote - Digital Production</title>
      </Head>

      <h1 className="mb-5">
        <b>{id ? 'Editar' : 'Cadastrar'} Lote</b>
      </h1>

      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-4">
            <Form.Label>Número do Lote</Form.Label>
            <Form.Control
              type="text"
              placeholder="LCW12345"
              {...register('identifier')}
              className={cx({ 'is-invalid': errors?.identifier })}
            />
            <div className="invalid-feedback">
              {errors?.identifier?.message}
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end gap-4">
            <Link href="/lots" passHref>
              <Button variant="outlined" type="button">
                Voltar
              </Button>
            </Link>

            {user?.role === 'admin' && <Button type="submit">Salvar</Button>}
          </div>
        </Form>
      </div>
    </div>
  );
});

export default Lot;
