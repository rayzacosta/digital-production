import { ProcessDAO, ProcessDTO } from 'src/persistence/process.dao';
import { CurrentUser } from 'src/types/userSession';
import { ProductService } from './product.service';
import { UserService } from './user.service';

export class ProcessService {
  private readonly processDAO: ProcessDAO;
  private readonly userService: UserService;

  constructor() {
    this.processDAO = new ProcessDAO();
    this.userService = new UserService();
  }

  async list() {
    return await this.processDAO.list();
  }

  async listAvailableByUser(currentUser: CurrentUser) {
    if (currentUser.role !== 'operator') {
      return this.list();
    }

    const user = await this.userService.read(currentUser.id);

    return user.processes;
  }

  async read(id: string) {
    return await this.processDAO.read(id);
  }

  async update(id: string, data: ProcessDTO) {
    return await this.processDAO.update(id, data);
  }

  async delete(id: string) {
    return await this.processDAO.delete(id);
  }

  async create(data: ProcessDTO) {
    return await this.processDAO.create(data);
  }

  async getCutProcess() {
    const CUT_PROCESS_ORDER = 1;

    return await this.processDAO.getByOrder(CUT_PROCESS_ORDER);
  }

  async isCutProcess(process_id: string) {
    const cutProcess = await this.getCutProcess();

    return process_id == cutProcess.id;
  }

  async isProcessAllowedToUser(process_id: string, user_id: string) {
    const user = await this.userService.read(user_id);

    const processFound = user.processes?.find((item) => item.id === process_id);

    return !!processFound;
  }
}
