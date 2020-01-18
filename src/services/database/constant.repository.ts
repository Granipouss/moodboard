import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { Constant } from '../../entities/constant';
import { Database } from './database';

@Service()
export class ConstantRepository {
  private repositoryPromise: Promise<Repository<Constant>>;
  constructor(database: Database) {
    this.repositoryPromise = database.getRepository(Constant);
  }

  async set(name: string, value: string) {
    const repository = await this.repositoryPromise;
    const existing = await repository.findOne(name);
    if (existing) {
      existing.value = value;
      repository.save(existing);
    } else {
      const constant = new Constant();
      constant.name = name;
      constant.value = value;
      repository.save(constant);
    }
  }

  async get(name: string) {
    const repository = await this.repositoryPromise;
    const existing = await repository.findOne(name);
    return existing ? existing.value : undefined;
  }
}
