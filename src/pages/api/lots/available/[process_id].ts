/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';

import { ProductionService } from 'src/services/production.service';
import { CurrentUser } from 'src/types/userSession';

const getAvailableLots = async (
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) => {
  const { process_id } = req.query;

  try {
    const productionService = new ProductionService();

    const lotsFound = await productionService.listAvailableToProduction(
      process_id as string,
      currentUser
    );

    return res.status(200).json(lotsFound);
  } catch (error: any) {
    console.log(error);

    const errorMessage = error?.message || error;
    return res.status(500).json({ error: errorMessage });
  }
};

const apiRoutes = async (
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) => {
  switch (req.method) {
    case 'GET':
      return getAvailableLots(req, res, currentUser);

    default:
      return res.status(404).json({});
  }
};

export default apiHandler(apiRoutes);
