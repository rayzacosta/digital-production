// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { ProductionService } from 'src/services/production.service';
import { CurrentUser } from 'src/types/userSession';

async function startProduction(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  const { lot_id, process_id, product_id } = req.body;
  try {
    const productionService = new ProductionService();

    const startedProduction = await productionService.startProduction({
      current_user,
      lot_id,
      process_id,
      product_id,
    });

    return res.status(201).json(startedProduction);
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
    case 'POST':
      requiredPermissions(['operator'], current_user, req, res);
      return startProduction(req, res, current_user);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
