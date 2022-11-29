import type { NextApiRequest, NextApiResponse } from 'next';
import { CurrentUser, UserRole } from 'src/types/userSession';

export const requiredPermissions = async (
  permissions: UserRole[],
  currentUser: CurrentUser,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!permissions.includes(currentUser.role)) {
    return res.status(403).json({
      error:
        'Seu usuário não possui permissão para acessar essa funcionalidade',
    });
  }
};
