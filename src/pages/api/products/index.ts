// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'src/helpers/api';
import { requiredPermissions } from 'src/helpers/api/requiredPermission';
import { ProductService } from 'src/services/product.service';
import { CurrentUser } from 'src/types/userSession';

async function listProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productService = new ProductService();

    const products = await productService.list();

    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.body;
  try {
    const productService = new ProductService();

    const createdProduct = await productService.create({ name });

    return res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function apiRoutes(
  req: NextApiRequest,
  res: NextApiResponse,
  current_user: CurrentUser
) {
  switch (req.method) {
    case 'GET':
      return listProducts(req, res);

    case 'POST':
      requiredPermissions(['admin'], current_user, req, res);
      return createProduct(req, res);

    default:
      return res.status(404).json({});
  }
}

export default apiHandler(apiRoutes);
