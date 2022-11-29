import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import { UserRole } from 'src/types/userSession';
import { useUser } from './useUser';

export const useCheckPermissionPage = (requiredRoles: UserRole[] = []) => {
  const router = useRouter();
  const user = useUser();

  React.useEffect(() => {
    if (!user || requiredRoles.length === 0) {
      return;
    }

    if (!requiredRoles.includes(user.role)) {
      router.push('/401');
      toast.error(
        'Você não possui permissão suficiente para acessar esse recurso'
      );
    }
  }, [user, requiredRoles, router]);
};
