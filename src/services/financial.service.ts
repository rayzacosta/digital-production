import { LotDTO } from 'src/persistence/lot.dao';
import { LotService } from 'src/services/lot.service';

type FinancialReportInput = {
  start_date: string;
  end_date: string;
  product_id?: string;
};

export class FinancialService {
  private readonly lotService: LotService;

  constructor() {
    this.lotService = new LotService();
  }

  private groupLotsByProduct(lots: LotDTO[]) {
    let result: { [product_id: string]: LotDTO[] } = {};

    for (let i = 0; i < lots.length; i++) {
      const lot = lots[i];
      const product_id = lot.product.id;

      if (!result[product_id]) {
        result[product_id] = [lot];
      } else {
        result[product_id] = [...result[product_id], lot];
      }
    }

    return result;
  }

  async getFinancialReport({
    start_date,
    end_date,
    product_id,
  }: FinancialReportInput) {
    const filteredLots = await this.lotService.listFiltered({
      start_completion_date: start_date,
      end_completion_date: end_date,
      product_id,
    });

    const groupedProducts = this.groupLotsByProduct(filteredLots);

    const products = Object.entries(groupedProducts).map(
      ([product_id, lots]) => {
        const product = lots[0].product;
        const cost_price = product.cost_price || 0;
        const sale_price = product.sale_price || 0;

        const amount_produced = lots.reduce((accumulator, current) => {
          return accumulator + current.amount;
        }, 0);

        const amount_cost_value = amount_produced * cost_price;
        const amount_sale_value = amount_produced * sale_price;
        const profit = amount_sale_value - amount_cost_value;

        return {
          ...product,
          financial: {
            cost_price,
            sale_price,
            amount_produced,
            amount_cost_value,
            amount_sale_value,
            profit,
          },
        };
      }
    );

    return {
      filter: { start_date, end_date, product_id },
      products,
    };
  }
}
