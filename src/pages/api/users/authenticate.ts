import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

import { apiHandler } from 'src/helpers/api';
import { UserService } from 'src/services';

const { serverRuntimeConfig } = getConfig();

async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  try {
    const userService = new UserService();

    const { password: _pass, ...userFound } = await userService.getUser(
      username,
      password
    );

    if (!userFound) {
      throw new Error('Usuário e senha inválidos');
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign(
      { sub: userFound.id, role: userFound.role },
      serverRuntimeConfig.secret,
      {
        expiresIn: '1d',
      }
    );

    // return basic user details and token
    return res.status(200).json({
      ...userFound,
      token,
    });
  } catch (error: any) {
    const errorMessage = error?.message || error;

    return res.status(500).json({
      error: errorMessage,
    });
  }
}

function apiRoutes(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return authenticate(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(apiRoutes);
