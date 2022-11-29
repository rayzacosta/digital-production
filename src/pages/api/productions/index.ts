// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';

import { ProductionService } from 'src/services/production.service';
import { CurrentUser } from 'src/types/userSession';

async function listProductions(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  try {
    const productionService = new ProductionService();

    const list = await productionService.list({ currentUser });

    return res.status(201).json(list);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    res.status(500).json({ error: errorMessage });
  }
}

async function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  switch (req.method) {
    case 'GET':
      return listProductions(req, res, current_user);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
