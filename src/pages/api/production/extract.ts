// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { ExtractService } from 'src/services/extract.service';
import { ProductionService } from 'src/services/production.service';
import { CurrentUser } from 'src/types/userSession';

async function getExtract(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  const { user_id, start_date, end_date } = req.query;

  try {
    const extractService = new ExtractService();

    const extractResult = await extractService.getExtractByUser({
      user_id: user_id as string,
      start_date: start_date as string,
      end_date: end_date as string,
    });

    return res.status(200).json(extractResult);
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
    case 'GET':
      requiredPermissions(['admin', 'manager'], current_user, req, res);
      return getExtract(req, res, current_user);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
