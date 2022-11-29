import moment from 'moment';
import {
  ProductionDAO,
  ProductionFilteredListResult,
} from 'src/persistence/production.dao';

export class ExtractService {
  private readonly productionDAO: ProductionDAO;

  constructor() {
    this.productionDAO = new ProductionDAO();
  }

  private groupProductionsByDate(productions: ProductionFilteredListResult[]): {
    [day: string]: ProductionFilteredListResult[];
  } {
    let result: { [date: string]: ProductionFilteredListResult[] } = {};

    for (let i = 0; i < productions.length; i++) {
      const production = productions[i];

      const date = moment(production.start_date).format('YYYY-MM-DD');

      if (!result[date]) {
        result[date] = [production];
      } else {
        result[date] = [...result[date], production];
      }
    }

    return result;
  }

  private groupProductionsByProcess(
    productions: ProductionFilteredListResult[]
  ): {
    [processId: string]: ProductionFilteredListResult[];
  } {
    let result: { [key: string]: ProductionFilteredListResult[] } = {};

    for (let i = 0; i < productions.length; i++) {
      const production = productions[i];

      const processId = production.process_id;

      if (!result[processId]) {
        result[processId] = [production];
      } else {
        result[processId] = [...result[processId], production];
      }
    }

    return result;
  }

  private calculateProduction(productions: ProductionFilteredListResult[]) {
    let result: {
      [processId: string]: {
        [day: string]: {
          day: string;
          processName: string;
          goal: number;
          requiredGoal: number;
          amount: number;
          valuePerExtraPiece?: number;
          productions: ProductionFilteredListResult[];
        };
      };
    } = {};

    const productionsGroupByDate = this.groupProductionsByDate(productions);

    Object.entries(productionsGroupByDate).forEach(([day, prods]) => {
      const productionsByProcess = this.groupProductionsByProcess(prods);

      Object.entries(productionsByProcess).forEach(
        ([processId, prodsProcess]) => {
          const productionAmountByProcessByDay = prodsProcess.reduce(
            (previousValue, currentValue) => {
              return previousValue + currentValue.amount;
            },
            0
          );

          const process = prodsProcess[0]?.process;

          let goalProductionAmountByProcessByDay =
            productionAmountByProcessByDay - process.goal;

          if (goalProductionAmountByProcessByDay < 0) {
            goalProductionAmountByProcessByDay = 0;
          }

          if (!result[processId]) {
            result[processId] = {};
          }

          result[processId][day] = {
            day,
            processName: process?.name,
            amount: productionAmountByProcessByDay,
            goal: goalProductionAmountByProcessByDay,
            requiredGoal: process.goal,
            valuePerExtraPiece: process.value_per_extra_piece,
            productions: prodsProcess,
          };
        }
      );
    });

    let payload: {
      valueToPay: number;
      totalExtraPieces: number;
      processes: {
        id: string;
        date: string;
        valueToPay: number;
        goal: number;
        amount: number;
        process: string;
        requiredGoal: number;
        valuePerExtraPiece?: number;
      }[];
    } = {
      valueToPay: 0,
      totalExtraPieces: 0,
      processes: [],
    };

    Object.entries(result).forEach(([processId, processes]) => {
      const processesObj = Object.entries(processes).map(([day, process]) => {
        let valueToPay = 0;

        const {
          amount,
          goal,
          processName,
          productions,
          requiredGoal,
          valuePerExtraPiece,
        } = process;

        if (valuePerExtraPiece) {
          valueToPay = goal * valuePerExtraPiece;
        }

        return {
          id: processId,
          date: day,
          valueToPay,
          goal,
          amount,
          process: processName,
          requiredGoal,
          valuePerExtraPiece,
          productions,
        };
      });

      payload.processes = [...payload.processes, ...processesObj];
    });

    const valueToPay = payload.processes.reduce(
      (previousValue, currentValue) => {
        return previousValue + currentValue.valueToPay;
      },
      0
    );

    const totalExtraPieces = payload.processes.reduce(
      (previousValue, currentValue) => {
        return previousValue + currentValue.goal;
      },
      0
    );

    payload.valueToPay = valueToPay;
    payload.totalExtraPieces = totalExtraPieces;

    return payload;
  }

  async getExtractByUser({
    user_id,
    start_date,
    end_date,
  }: {
    user_id: string;
    start_date: string;
    end_date: string;
  }) {
    const productions = await this.productionDAO.listFiltered({
      user_id,
      start_date,
      end_date,
    });

    return this.calculateProduction(productions);
  }
}
