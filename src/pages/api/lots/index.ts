// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { LotService } from 'src/services/lot.service';
import { CurrentUser } from 'src/types/userSession';

async function getLots(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lotService = new LotService();

    const lots = await lotService.list();

    return res.status(200).json(lots);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function createLot(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lotService = new LotService();

    const createdLot = await lotService.create(req.body);

    return res.status(201).json(createdLot);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const apiRoutes = async (
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) => {
  switch (req.method) {
    case 'GET':
      return getLots(req, res);

    case 'POST':
      requiredPermissions(['admin', 'manager'], currentUser, req, res);

      return createLot(req, res);

    default:
      return res.status(404).json({});
  }
};

export default apiHandler(apiRoutes);
