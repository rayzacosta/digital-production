import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService } from 'src/services';
import { Form, Image } from 'react-bootstrap';
import Head from 'next/head';

type UserForm = {
  username: string;
  password: string;
};

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (userService.userValue) {
      if (userService.userValue.role === 'operator') {
        router.push('/mobile');
      } else {
        router.push('/');
      }
    }
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('O usuário é obrigatório'),
    password: Yup.string().required('A senha é obrigatório'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, setError, formState } =
    useForm<UserForm>(formOptions);
  const { errors } = formState;

  function onSubmit({ username, password }: UserForm) {
    return userService
      .login(username, password)
      .then((data) => {
        if (['admin', 'manager'].includes(data.role)) {
          return router.push('/');
        }

        router.push('/mobile');
      })
      .catch((error) => {
        const message = error?.response?.data?.error || error.message || error;

        setError('apiError' as any, { message });
      });
  }

  return (
    <div
      style={{ minHeight: '70vh' }}
      className="col-md-6 offset-md-3 mt-5 d-flex flex-column justify-content-center"
    >
      <Head>
        <title>Login - Digital Production</title>
      </Head>

      <div className="card">
        {/* <h4 className="card-header fw-bold">Login</h4> */}
        <div className="card-body d-flex flex-column">
          <Image
            className="align-self-center mb-4"
            src="https://res.cloudinary.com/dpmunc2ma/image/upload/v1669684385/digital-production/assets/images/alfaiate_usk1pz.png"
            width="auto"
            height={220}
            alt="Login illustration"
          />

          <Form
            className="d-flex flex-column"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group mb-3">
              <Form.Label>Usuário</Form.Label>
              <Form.Control
                type="text"
                {...register('username')}
                className={`form-control ${
                  errors.username ? 'is-invalid' : ''
                }`}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-group mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                {...register('password')}
                className={`form-control ${
                  errors.password ? 'is-invalid' : ''
                }`}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <button
              disabled={formState.isSubmitting}
              className="btn btn-primary ms-auto"
            >
              {formState.isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Entrar
            </button>
            {(errors as any).apiError && (
              <div className="alert alert-danger mt-3 mb-0">
                {(errors as any).apiError?.message}
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
