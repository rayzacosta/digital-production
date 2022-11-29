// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { ProductService } from 'src/services/product.service';
import { CurrentUser } from 'src/types/userSession';

const addProcesses = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { processes_id } = req.body;
  try {
    const service = new ProductService();

    const result = await service.addProcessesToProduct(
      id as string,
      processes_id
    );

    return res.status(201).json(result);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    res.status(500).json({ error: errorMessage });
  }
};

async function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUser: CurrentUser
) {
  switch (req.method) {
    case 'PATCH':
      requiredPermissions(['admin'], currentUser, req, res);
      return await addProcesses(req, res);

    default:
      return res.status(404);
  }
}

export default apiHandler(apiRoutes);
