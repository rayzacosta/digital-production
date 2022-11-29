import React from 'react';
import { Link } from 'src/components';
import withProvider from 'src/hocs/withProvider';
import {
  ProductsProvider,
  useProductsEffects,
  useProductsState,
} from 'src/providers/products.provider';
import { useRouter } from 'next/router';
import { Form, Button, FormCheck, Container, Row, Col } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import cx from 'classnames';
import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import Head from 'next/head';

type ProductForm = {
  name: string;
  cost_price?: number;
  sale_price?: number;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('O campo nome é obrigatório'),
});

const Product = withProvider(
  ProductsProvider,
  ProcessesProvider
)(() => {
  const { product, isLoading } = useProductsState();
  const { fetchProductById, createProduct, updateProduct } =
    useProductsEffects();

  const { processes } = useProcessesState();
  const { fetchProcesses } = useProcessesEffects();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm<ProductForm>({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  const [id] = (router.query.pid as string[]) || [];

  const onSubmit = (data: ProductForm) => {
    if (product?.id) {
      console.log('data:::', data);
      updateProduct(data);
    } else {
      createProduct(data);
    }
  };

  useCheckPermissionPage(['admin', 'manager']);

  React.useEffect(() => {
    if (!!product && !isLoading) {
      setValue('name', product.name);

      setValue('cost_price', product.cost_price || 0);
      setValue('sale_price', product.sale_price || 0);
    }
  }, [isLoading, product]);

  React.useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  return (
    <Container className="pt-5">
      <Head>
        <title>
          {id ? 'Editar' : 'Cadastrar'} Produto - Digital Production
        </title>
      </Head>

      <h1 className="mb-5">
        <b>{id ? 'Editar' : 'Cadastrar'} Produto</b>
      </h1>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do produto"
                {...register('name')}
                className={cx({ 'is-invalid': errors?.name })}
              />
              <div className="invalid-feedback">{errors?.name?.message}</div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Preço de Custo</Form.Label>
              <Form.Control
                type="number"
                placeholder="Preço de Custo"
                {...register('cost_price')}
                className={cx({ 'is-invalid': errors?.cost_price })}
              />
              <div className="invalid-feedback">
                {errors?.cost_price?.message}
              </div>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Preço de Venda</Form.Label>
              <Form.Control
                type="number"
                placeholder="Preço de Venda"
                {...register('sale_price')}
                className={cx({ 'is-invalid': errors?.sale_price })}
              />
              <div className="invalid-feedback">
                {errors?.sale_price?.message}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-3">
          <Link href="/products" passHref>
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

export default Product;
