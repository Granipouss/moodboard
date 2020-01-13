import { Service } from 'typedi';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';

import { Constant } from '../../entities/constant';
import { Image } from '../../entities/image';

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./db.sqlite`,
  entities: [Constant, Image],
  synchronize: true,
  logging: true,
};

@Service()
export class Database {
  public static async create(): Promise<Database> {
    const connection = await createConnection(options);
    return new Database(connection);
  }

  public constructor(private connection: Connection) {}

  private constantRepo = this.connection.getRepository(Constant);
  public imageRepo = this.connection.getRepository(Image);

  async setConstant(name: string, value: string) {
    const existing = await this.constantRepo.findOne(name);
    if (existing) {
      existing.value = value;
      this.constantRepo.save(existing);
    } else {
      const constant = new Constant();
      constant.name = name;
      constant.value = value;
      this.constantRepo.save(constant);
    }
  }

  async getConstant(name: string) {
    const existing = await this.constantRepo.findOne(name);
    return existing ? existing.value : undefined;
  }
}
