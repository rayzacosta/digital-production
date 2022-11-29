import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import React from 'react';

type BackbarProps = {
  title: string | React.ReactNode;
  href?: string;
};

export const Backbar = ({ title, href }: BackbarProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (!href) {
      router.back();
      return;
    }

    router.push(href);
  };

  return (
    <div className="d-flex gap-3 align-items-center mb-4">
      <Icon
        role="button"
        aria-label="Voltar"
        onClick={handleBack}
        icon="bi:chevron-left"
        className="text-dark fs-1"
      />

      <h2 className="mb-0 w-100">
        <b>{title}</b>
      </h2>
    </div>
  );
};
