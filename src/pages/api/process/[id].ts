/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';

import { ProcessService } from 'src/services/process.service';
import { CurrentUser } from 'src/types/userSession';

const getById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const service = new ProcessService();

    const processFound = await service.read(id as string);

    return res.status(200).json(processFound);
  } catch (error: any) {
    res.status(500).json({ ...error });
  }
};

const deleteById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const service = new ProcessService();

    const processDeleted = await service.delete(id as string);

    return res.status(200).json(processDeleted);
  } catch (error: any) {
    return res.status(500).json(error);
  }
};

const updateById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const service = new ProcessService();

    const updated = await service.update(id as string, req.body);

    return res.status(200).json(updated);
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
      return await getById(req, res);
    case 'PATCH':
      requiredPermissions(['admin'], currentUser, req, res);
      return await updateById(req, res);
    case 'DELETE':
      requiredPermissions(['admin'], currentUser, req, res);
      return await deleteById(req, res);
    default:
      return res.status(404).json({});
  }
};

export default apiHandler(apiRoutes);
