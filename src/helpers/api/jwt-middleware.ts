import { expressjwt } from 'express-jwt';
import * as util from 'util';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

function jwtMiddleware(req: any, res: any) {
  const middleware = expressjwt({
    secret: serverRuntimeConfig.secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/authenticate',
    ],
  });

  return util.promisify(middleware)(req, res);
}

export { jwtMiddleware };
