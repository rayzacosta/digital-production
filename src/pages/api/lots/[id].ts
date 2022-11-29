/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';

import { LotService } from 'src/services/lot.service';
import { CurrentUser } from 'src/types/userSession';

const getLotById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const lotService = new LotService();

    const lotFound = await lotService.read(id as string);

    return res.status(200).json(lotFound);
  } catch (error: any) {
    res.status(500).json({ ...error });
  }
};

const updateLot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const lotService = new LotService();

    const lotUpdated = await lotService.update(id as string, req.body);

    return res.status(200).json(lotUpdated);
  } catch (error: any) {
    res.status(500).json({ ...error });
  }
};

const deleteLot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const lotService = new LotService();

    const lotUpdated = await lotService.delete(id as string);

    return res.status(200).json(lotUpdated);
  } catch (error: any) {
    res.status(500).json({ ...error });
  }
};

const apiRoutes = async (
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) => {
  switch (req.method) {
    case 'GET':
      return getLotById(req, res);

    case 'PATCH':
      requiredPermissions(['admin', 'manager'], currentUser, req, res);

      return updateLot(req, res);

    case 'DELETE':
      requiredPermissions(['admin', 'manager'], currentUser, req, res);

      return deleteLot(req, res);

    default:
      return res.status(404).json({});
  }
};

export default apiHandler(apiRoutes);
