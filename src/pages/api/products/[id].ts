/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';

import { ProductService } from 'src/services/product.service';
import { CurrentUser } from 'src/types/userSession';

const getProductById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const productService = new ProductService();

    const productFound = await productService.read(id as string);

    return res.status(200).json(productFound);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    res.status(500).json({ error: errorMessage });
  }
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const productService = new ProductService();

    const productUpdated = await productService.update(id as string, req.body);

    return res.status(200).json(productUpdated);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    res.status(500).json({ error: errorMessage });
  }
};

const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const productService = new ProductService();

    const productUpdated = await productService.delete(id as string);

    return res.status(200).json(productUpdated);
  } catch (error: any) {
    const errorMessage = error?.message || error;
    res.status(500).json({ error: errorMessage });
  }
};

async function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  switch (req.method) {
    case 'GET':
      return getProductById(req, res);

    case 'PATCH':
      requiredPermissions(['admin'], current_user, req, res);
      return updateProduct(req, res);

    case 'DELETE':
      requiredPermissions(['admin'], current_user, req, res);
      return deleteProduct(req, res);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
