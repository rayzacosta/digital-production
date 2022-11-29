import type { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler, jwtMiddleware } from 'src/helpers/api';
import jwt from 'jsonwebtoken';

import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

function apiHandler(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // global middleware
      await jwtMiddleware(req, res);

      const token = req.headers.authorization
        ? req.headers.authorization?.replace('Bearer', '').trim()
        : '';

      let currentUser: any;

      jwt.verify(
        token,
        serverRuntimeConfig.secret,
        (err: any, decoded: any) => {
          if (err) {
            console.error(err);
          }

          if (decoded) {
            currentUser = {
              id: decoded.sub,
              role: decoded.role,
            };
          }
        }
      );

      await handler(req, res, currentUser);
    } catch (err) {
      // global error handler
      errorHandler(err, res);
    }
  };
}

export { apiHandler };
