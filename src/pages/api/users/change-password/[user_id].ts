import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { UserService } from 'src/services';
import { CurrentUser } from 'src/types/userSession';

async function changePassword(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  const userService = new UserService();
  const { new_password } = req.body;
  const { user_id } = req.query;

  try {
    const updated = await userService.updatePassword(
      user_id as string,
      new_password
    );

    return res.status(200).json(updated);
  } catch (error: any) {
    const errorMessage = error?.message || error;

    return res.status(500).json({ error: errorMessage });
  }
}

function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  switch (req.method) {
    case 'PATCH':
      requiredPermissions(['admin'], currentUser, req, res);
      return changePassword(req, res, currentUser);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(apiRoutes);
