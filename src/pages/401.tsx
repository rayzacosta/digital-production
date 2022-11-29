import Head from 'next/head';
import React from 'react';

const Error401 = () => {
  return (
    <div className="d-flex flex-column">
      <Head>
        <title>Acesso não autorizado</title>
      </Head>

      <div className="alert alert-danger">Acesso não autorizado</div>
    </div>
  );
};

export default Error401;
