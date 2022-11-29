// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { ProductionService } from 'src/services/production.service';
import { CurrentUser } from 'src/types/userSession';

async function stopProduction(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  const { production_id, amount } = req.body;

  try {
    const productionService = new ProductionService();

    const stoppedProduction = await productionService.stopProduction({
      current_user,
      amount,
      production_id,
    });

    return res.status(201).json(stoppedProduction);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    console.log(error, errorMessage);
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
      return stopProduction(req, res, current_user);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
