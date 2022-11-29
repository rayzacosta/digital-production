import { ProcessService } from 'src/services/process.service';
import { LotDAO, LotFilter } from 'src/persistence/lot.dao';
import { ProductService } from 'src/services/product.service';
import { LotProcessDAO } from 'src/persistence/lotProcess.dao';

export class LotService {
  private readonly lotDao: LotDAO;
  private readonly lotProcessDAO: LotProcessDAO;
  private readonly productService: ProductService;
  private readonly processService: ProcessService;

  constructor() {
    this.lotDao = new LotDAO();
    this.lotProcessDAO = new LotProcessDAO();
    this.productService = new ProductService();
    this.processService = new ProcessService();
  }

  async list() {
    return await this.lotDao.list();
  }

  async listFiltered(filter: LotFilter) {
    return this.lotDao.filteredList(filter);
  }

  async read(id: string) {
    return await this.lotDao.read(id);
  }

  async delete(id: string) {
    return this.lotDao.delete(id);
  }

  async update(id: string, data: any) {
    return await this.lotDao.update(id, data);
  }

  async lotsAvailableToProduction() {
    return this.lotDao.lotsAvailableToProduction();
  }

  async create(data: any) {
    return await this.lotDao.create(data);
  }

  async generateProcessesOnCut(lot_id: string, amount: number) {
    const lot = await this.read(lot_id);
    const product = await this.productService.read(lot.product.id);

    const cutProcess = await this.processService.getCutProcess();

    const generatedProcesses = product.processes.map((process: any) => ({
      lot_id,
      process_id: process.id,
      amount,
      remaining_amount: cutProcess.id === process.id ? 0 : amount,
    }));

    return this.lotProcessDAO.saveGeneratedProcesses(generatedProcesses);
  }

  async getLotProcess(lot_id: string, process_id: string) {
    const isCutProcess = await this.processService.isCutProcess(process_id);

    if (isCutProcess) {
      const lot = await this.read(lot_id);

      return {
        lot,
        remaining_amount: 0,
        amount: 0,
        lot_id,
        process_id,
        isCutProcess,
      };
    }

    return this.lotProcessDAO.getLotProcess(lot_id, process_id);
  }

  async debitAmountProcessFromLot(
    lot_id: string,
    process_id: string,
    amount: number
  ) {
    const lotProcess = await this.getLotProcess(lot_id, process_id);

    if (lotProcess.remaining_amount < amount) {
      throw new Error(
        `A quantidade de items à serem registrados é maior que a quantidade disponível. Quantidade disponível: ${lotProcess.remaining_amount}`
      );
    }

    return await this.lotProcessDAO.updateLotProcess(lot_id, process_id, {
      remaining_amount: lotProcess.remaining_amount - amount,
    });
  }

  async checkIsLotIsCompleted(lot_id: string) {
    const processes = await this.lotProcessDAO.getProcessesByLot(lot_id);

    if (!processes.length) {
      throw new Error(`Não existe nenhum processo para lote: ${lot_id}`);
    }

    const remainingAmountList = processes
      .map(
        ({ remaining_amount }: { remaining_amount: number }) => remaining_amount
      )
      .reduce((partialSum, a) => partialSum + a, 0);

    const lotCompleted = remainingAmountList === 0;

    return lotCompleted;
  }
}
