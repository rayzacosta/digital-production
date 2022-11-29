import { ProductDAO } from 'src/persistence/product.dao';
import { ProcessService } from './process.service';

export class ProductService {
  private readonly productDao: ProductDAO;
  private readonly processService: ProcessService;

  constructor() {
    this.productDao = new ProductDAO();
    this.processService = new ProcessService();
  }

  async list() {
    return await this.productDao.list();
  }

  async read(id: string) {
    return await this.productDao.read(id);
  }

  async delete(id: string) {
    const processesByProduct = await this.productDao.getProcessesFromProduct(
      id
    );

    if (processesByProduct.length > 1) {
      throw Error(
        'Esse produto possui vinculo com os processos, tente remover esses vinculos e tente novamente!'
      );
    }

    if (processesByProduct.length === 1) {
      const cutProcess = await this.processService.getCutProcess();

      if (processesByProduct[0].process_id !== cutProcess.id) {
        throw Error(
          'Esse produto possui vinculo com um processo diferente do corte, verifique e tente novamente!'
        );
      }
    }

    return this.productDao.delete(id);
  }

  async update(id: string, data: any) {
    const { name, cost_price, sale_price } = data;

    return await this.productDao.update(id, {
      name,
      cost_price: +cost_price,
      sale_price: +sale_price,
    });
  }

  async create(data: any) {
    const createdProduct = await this.productDao.create(data);

    const cutProcess = await this.processService.getCutProcess();

    await this.addProcessesToProduct(createdProduct.id, [cutProcess.id]);

    return this.read(createdProduct.id);
  }

  async addProcessesToProduct(product_id: string, processes_id: string[]) {
    if (!product_id) {
      throw new Error('O id do produto é obrigatório!');
    }

    if (!processes_id || !processes_id.length) {
      throw new Error('Os processos são obrigatório!');
    }

    return this.productDao.addProcessesToProduct(product_id, processes_id);
  }
}
