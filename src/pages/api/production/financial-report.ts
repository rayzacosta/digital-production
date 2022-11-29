// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { FinancialService } from 'src/services/financial.service';
import { CurrentUser } from 'src/types/userSession';

async function getFinancialReport(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  const { start_date, end_date, product_id } = req.query;

  try {
    const financialService = new FinancialService();

    const financialResult = await financialService.getFinancialReport({
      start_date: start_date as string,
      end_date: end_date as string,
      product_id: product_id as string,
    });

    return res.status(200).json(financialResult);
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
      requiredPermissions(['admin'], current_user, req, res);
      return getFinancialReport(req, res, current_user);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
