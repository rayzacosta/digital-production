import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { UserService } from 'src/services';
import { CurrentUser } from 'src/types/userSession';

async function createUser(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  const userService = new UserService();
  const { username, password, name } = req.body;

  try {
    const createdUser = await userService.create({
      username,
      password,
      name,
    });

    return res.status(200).json(createdUser);
  } catch (error: any) {
    const errorMessage = error?.message || error;

    return res.status(500).json({ error: errorMessage });
  }
}

async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  const userService = new UserService();
  try {
    const users = await userService.list();

    return res.status(200).json(users);
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
    case 'GET':
      requiredPermissions(['admin', 'manager'], currentUser, req, res);
      return getUsers(req, res, currentUser);
    case 'POST':
      requiredPermissions(['admin'], currentUser, req, res);
      return createUser(req, res, currentUser);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(apiRoutes);
