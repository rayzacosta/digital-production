/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';

import { LotService } from 'src/services/lot.service';
import { CurrentUser } from 'src/types/userSession';

async function getLotAvailableDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { process_id, lot_id } = req.query;

  try {
    const lotService = new LotService();

    const lotProcessDetails = await lotService.getLotProcess(
      lot_id as string,
      process_id as string
    );

    return res.status(200).json(lotProcessDetails);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    return res.status(500).json({ error: errorMessage });
  }
}

const apiRoutes = async (
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) => {
  switch (req.method) {
    case 'GET':
      return getLotAvailableDetails(req, res);

    default:
      return res.status(404).json({});
  }
};

export default apiHandler(apiRoutes);
