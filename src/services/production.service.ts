import moment from 'moment';
import { getCurrentDate, getDuration } from 'src/helpers/dates';
import { sortByKey } from 'src/helpers/sort';
import { LotDTO } from 'src/persistence/lot.dao';
import { LotProcessDAO, LotProcessDTO } from 'src/persistence/lotProcess.dao';
import { ProductDAO } from 'src/persistence/product.dao';
import { ProductionDAO, ProductionDTO } from 'src/persistence/production.dao';
import { LotService } from 'src/services/lot.service';
import { CurrentUser } from 'src/types/userSession';
import { ProcessService } from './process.service';

type RegisterCutDTO = {
  lot_id: string;
  start_date: string;
  end_date: string;
  amount: number;
};

type RegisterProductionParams = {
  lot_id: string;
  start_date: string;
  end_date: string;
  amount: number;
  process_id: string;
};

type StartProductionParams = {
  lot_id: string;
  process_id: string;
  current_user: CurrentUser;
  product_id: string;
};

type StopProductionParams = {
  production_id: string;
  amount: number;
  current_user: CurrentUser;
};

type StartCutProductionParams = {
  lot_id: string;
  process_id: string;
  product_id: string;
  current_user: CurrentUser;
};

type StopCutProductionParams = {
  production_id: string;
  amount: number;
  current_user: CurrentUser;
};

type ProductionsFilterInput = {
  user_id: string;
  start_date: string;
  end_date: string;
};

export class ProductionService {
  private readonly lotService: LotService;
  private readonly processService: ProcessService;
  private readonly productionDAO: ProductionDAO;
  private readonly lotProcessDAO: LotProcessDAO;

  constructor() {
    this.lotService = new LotService();
    this.processService = new ProcessService();
    this.productionDAO = new ProductionDAO();
    this.lotProcessDAO = new LotProcessDAO();
  }

  async listInProgress({ currentUser }: { currentUser: CurrentUser }) {
    if (currentUser.role === 'operator') {
      return this.productionDAO.listFiltered(
        {
          user_id: currentUser.id,
        },
        true
      );
    }

    return this.productionDAO.listFiltered({}, true);
  }

  async list({ currentUser }: { currentUser: CurrentUser }) {
    return this.productionDAO.list();
  }

  async read(id: string) {
    const production = await this.productionDAO.read(id);

    const lotProcess = production.lot.lot_process?.find(
      (item) => item.process_id === production.process.id
    );

    if (lotProcess) {
      return {
        ...production,
        remaining_amount: lotProcess.remaining_amount,
      };
    }

    return production;
  }

  async delete(id: string) {
    return this.productionDAO.delete(id);
  }

  async update(id: string, data: any) {
    return this.productionDAO.update(id, data);
  }

  async listAvailableToProduction(
    process_id: string,
    currentUser: CurrentUser
  ) {
    const isCutProcess = await this.processService.isCutProcess(process_id);

    if (isCutProcess) {
      const availableLots = await this.lotService.lotsAvailableToProduction();

      return availableLots
        .filter((lot) => !lot.cut)
        .map((item) => {
          return {
            ...item,
            lot: {
              identifier: item.identifier,
              id: item.id,
            },
          };
        });
    }

    return await this.lotProcessDAO.lotProcessesAvailableToProduction(
      process_id
    );
  }

  async productionInProgressByProcess(process_id: string) {
    return this.productionDAO.listFiltered({ process_id });
  }

  async getFilteredProductions({
    end_date,
    start_date,
    user_id,
  }: ProductionsFilterInput) {
    const result = await this.productionDAO.listFiltered({
      end_date,
      start_date,
      user_id,
    });

    return result.sort(sortByKey('start_date')).map((item) => {
      const { formatted: duration } = getDuration(
        item.start_date,
        item.end_date
      );

      return {
        ...item,
        duration,
      };
    });
  }

  // Cut production

  async startCutProduction({
    current_user,
    lot_id,
    product_id,
    process_id,
  }: StartCutProductionParams) {
    if (!lot_id || !process_id || !product_id) {
      throw new Error('Preencha todos os campos para registrar o corte!');
    }

    const lot = await this.lotService.read(lot_id);

    if (lot.cut) {
      throw new Error('Esse lote já foi cortado!');
    }

    const currentDate = getCurrentDate();

    const production: Partial<ProductionDTO> = {
      start_date: currentDate,
      lot_id,
      process_id,
      user_id: current_user.id,
    };

    const lotChanges: Partial<LotDTO> = {
      cut: true,
      product_id,
    };

    await this.lotService.update(lot_id, lotChanges);

    return this.productionDAO.create(production);
  }

  async stopCutProduction({
    production_id,
    amount,
    current_user,
  }: StopCutProductionParams) {
    const production = await this.productionDAO.read(production_id);

    if (current_user.id !== production.user.id) {
      throw new Error('O usuário é diferente do que iniciou o trabalho');
    }

    if (production.end_date) {
      throw new Error('Essa produção já foi registrada');
    }

    const currentDate = getCurrentDate();

    const lotChanges: Partial<LotDTO> = {
      amount,
      cut_date: currentDate,
    };

    const lot_id = production.lot.id;

    await this.lotService.generateProcessesOnCut(lot_id, amount);

    await this.lotService.update(lot_id, lotChanges);

    return await this.productionDAO.update(production_id, {
      end_date: currentDate,
      amount,
    });
  }

  // Production

  async startProduction({
    lot_id,
    process_id,
    product_id,
    current_user,
  }: StartProductionParams) {
    if (!lot_id || !process_id || !current_user) {
      throw new Error('Preencha todos os campos para registrar a produção!');
    }

    const isCutProcess = await this.processService.isCutProcess(process_id);

    if (isCutProcess) {
      return await this.startCutProduction({
        lot_id,
        process_id,
        current_user,
        product_id,
      });
    }

    const lot = await this.lotService.read(lot_id);

    if (!lot.cut) {
      throw new Error('Esse lote ainda não foi cortado!');
    }

    if (lot.completion_date) {
      throw new Error('Esse lote já foi finalizado!');
    }

    const production: Partial<ProductionDTO> = {
      user_id: current_user.id,
      start_date: getCurrentDate(),
      lot_id,
      process_id,
    };

    return this.productionDAO.create(production);
  }

  async stopProduction({
    production_id,
    amount,
    current_user,
  }: StopProductionParams) {
    const production = await this.productionDAO.read(production_id);

    if (current_user.id !== production.user.id) {
      throw new Error('O usuário é diferente do que iniciou o trabalho');
    }

    const isCutProcess = await this.processService.isCutProcess(
      production.process.id
    );

    if (isCutProcess) {
      return await this.stopCutProduction({
        production_id,
        amount,
        current_user,
      });
    }

    await this.lotService.debitAmountProcessFromLot(
      production.lot.id,
      production.process.id,
      amount
    );

    const lotCompleted = await this.lotService.checkIsLotIsCompleted(
      production.lot.id
    );

    const currentDate = getCurrentDate();

    if (lotCompleted) {
      await this.lotService.update(production.lot.id, {
        completion_date: currentDate,
      });
    }

    return await this.productionDAO.update(production.id, {
      end_date: currentDate,
      amount,
    });
  }
}
