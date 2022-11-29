import React from 'react';
import { Link } from 'src/components';
import withProvider from 'src/hocs/withProvider';
import {
  ProcessesProvider,
  useProcessesEffects,
  useProcessesState,
} from 'src/providers/processes.provider';
import { useRouter } from 'next/router';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import cx from 'classnames';
import { useCheckPermissionPage } from 'src/hooks/useCheckPermissionPage';
import { Icon } from '@iconify/react';
import Head from 'next/head';

type ProcessForm = {
  name: string;
  goal: number;
  value_per_extra_piece: number;
  icon: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('O campo nome é obrigatório'),
  value_per_extra_piece: Yup.number()
    .typeError('O valor deve ser um número')
    .min(0.01, 'O valor mínimo para esse campo é 0.01')
    .required('O campo nome é obrigatório'),
  goal: Yup.number()
    .typeError('O valor deve ser um número')
    .min(1, 'O valor mínimo para o campo é 1')
    .required('O campo nome é obrigatório'),
  icon: Yup.string().required('O campo de ícone é obrigatório'),
});

const Process = withProvider(ProcessesProvider)(() => {
  const { process, isLoading } = useProcessesState();
  const { fetchProcessById, createProcess, updateProcess } =
    useProcessesEffects();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ProcessForm>({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  const [id] = (router.query.pid as string[]) || [];

  useCheckPermissionPage(['admin', 'manager']);

  const onSubmit = (data: ProcessForm) => {
    if (process?.id) {
      updateProcess(data);
    } else {
      createProcess(data);
    }
  };

  React.useEffect(() => {
    if (!!process && !isLoading) {
      setValue('name', process.name);
      setValue('icon', process.icon);
      setValue('goal', process.goal);
      setValue('value_per_extra_piece', process.value_per_extra_piece);
    }
  }, [isLoading, process]);

  React.useEffect(() => {
    if (id) {
      fetchProcessById(id);
    }
  }, [id]);

  return (
    <Container className="pt-5">
      <Head>
        <title>
          {id ? 'Editar' : 'Cadastrar'} Processo - Digital Production
        </title>
      </Head>

      <h1 className="mb-5">
        <b>{id ? 'Editar' : 'Cadastrar'} Processo</b>
      </h1>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Nome do Processo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do Processo"
                {...register('name')}
                className={cx({ 'is-invalid': errors?.name })}
              />
              <div className="invalid-feedback">{errors?.name?.message}</div>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Meta</Form.Label>
              <Form.Control
                type="number"
                placeholder="Meta"
                defaultValue={0}
                {...register('goal')}
                className={cx({ 'is-invalid': errors?.goal })}
              />
              <div className="invalid-feedback">{errors?.goal?.message}</div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <Form.Group className="mb-4">
              <Form.Label>Valor por Peça Extra</Form.Label>
              <Form.Control
                type="number"
                defaultValue={0}
                min={0.01}
                placeholder="Valor por Peça Extra"
                {...register('value_per_extra_piece')}
                className={cx({ 'is-invalid': errors?.value_per_extra_piece })}
              />
              <div className="invalid-feedback">
                {errors?.value_per_extra_piece?.message}
              </div>
            </Form.Group>
          </Col>

          <Col md="5">
            <Form.Group className="mb-4">
              <Form.Label>
                Ícone do processo
                <OverlayTrigger
                  placement="top"
                  trigger="click"
                  overlay={
                    <Tooltip id={`tooltip-icon`}>
                      Encontre o nome do seu ícone nesse link{' '}
                      <a
                        target="_blank"
                        href="https://icon-sets.iconify.design/"
                        rel="noreferrer"
                      >
                        Iconify
                      </a>
                    </Tooltip>
                  }
                >
                  <Icon
                    className="ms-3"
                    icon="material-symbols:info-outline-rounded"
                  />
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ícone"
                {...register('icon')}
                className={cx({ 'is-invalid': errors?.icon })}
              />
              <div className="invalid-feedback">{errors?.icon?.message}</div>
            </Form.Group>
          </Col>

          <Col md="1">
            <div className="d-flex flex-column align-items-center justify-content-end h-100 pb-5">
              <Icon className="text-primary fs-1" icon={watch('icon')} />
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-3">
          <Link href="/processes" passHref>
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

export default Process;
