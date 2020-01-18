import { Service, ObjectType } from 'typedi';
import { createConnection, Repository } from 'typeorm';

import { Constant } from '../../entities/constant';
import { Image } from '../../entities/image';

@Service()
export class Database {
  private connectionPromise = createConnection({
    type: 'sqlite',
    database: './db.sqlite',
    entities: [Constant, Image],
    synchronize: true,
    logging: true,
  });

  public getRepository<Entity>(
    target: ObjectType<Entity>,
  ): Promise<Repository<Entity>> {
    return this.connectionPromise.then(connection =>
      connection.getRepository(target),
    );
  }
}
