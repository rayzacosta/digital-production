// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { ProcessService } from 'src/services/process.service';
import { CurrentUser } from 'src/types/userSession';

const getList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const service = new ProcessService();

    const list = await service.list();

    return res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const service = new ProcessService();

    const createdProcess = await service.create(req.body);

    return res.status(201).json(createdProcess);
  } catch (error) {
    res.status(500).json(error);
  }
};

async function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  if (req.method === 'GET') {
    return await getList(req, res);
  } else if (req.method === 'POST') {
    requiredPermissions(['admin'], currentUser, req, res);

    return await create(req, res);
  } else {
    res.status(404);
  }
}

export default apiHandler(apiRoutes);
