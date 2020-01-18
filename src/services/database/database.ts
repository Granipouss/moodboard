import { Service, ObjectType } from 'typedi';
import {
  createConnection,
  ConnectionOptions,
  Connection,
  Repository,
} from 'typeorm';

import { Constant } from '../../entities/constant';
import { Image } from '../../entities/image';

@Service()
export class Database {
  public static async create(): Promise<Database> {
    const options: ConnectionOptions = {
      type: 'sqlite',
      database: './db.sqlite',
      entities: [Constant, Image],
      synchronize: true,
      logging: true,
    };
    const connection = await createConnection(options);
    return new Database(connection);
  }

  public constructor(private connection: Connection) {}

  public getRepository<Entity>(target: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(target);
  }
}
