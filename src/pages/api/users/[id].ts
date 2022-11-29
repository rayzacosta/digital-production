/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { UserService } from 'src/services';
import { CurrentUser } from 'src/types/userSession';

const getUserById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) => {
  const { id } = req.query;

  try {
    const userService = new UserService();

    const userFound = await userService.read(id as string);

    return res.status(200).json(userFound);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    res.status(500).json({ error: errorMessage });
  }
};

const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) => {
  const { id } = req.query;

  try {
    const userService = new UserService();

    const userUpdated = await userService.update(
      id as string,
      req.body,
      current_user
    );

    return res.status(200).json(userUpdated);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    return res.status(500).json({ error: errorMessage });
  }
};

async function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  switch (req.method) {
    case 'GET':
      return await getUserById(req, res, currentUser);

    case 'PUT':
      requiredPermissions(['admin'], currentUser, req, res);
      return await updateUser(req, res, currentUser);

    default:
      return res.status(404);
  }
}

export default apiHandler(apiRoutes);
