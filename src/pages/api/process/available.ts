// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { ProcessService } from 'src/services/process.service';
import { CurrentUser } from 'src/types/userSession';

const getAvailableProcessesByUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) => {
  try {
    const service = new ProcessService();

    const list = await service.listAvailableByUser(currentUser);

    return res.status(200).json(list);
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
    return await getAvailableProcessesByUser(req, res, currentUser);
  } else {
    res.status(404);
  }
}

export default apiHandler(apiRoutes);
