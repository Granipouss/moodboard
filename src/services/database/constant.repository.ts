import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { Constant } from '../../entities/constant';
import { Database } from './database';

@Service()
export class ConstantRepository {
  private repository: Repository<Constant>;
  constructor(database: Database) {
    this.repository = database.getRepository(Constant);
  }

  async set(name: string, value: string) {
    const existing = await this.repository.findOne(name);
    if (existing) {
      existing.value = value;
      this.repository.save(existing);
    } else {
      const constant = new Constant();
      constant.name = name;
      constant.value = value;
      this.repository.save(constant);
    }
  }

  async get(name: string) {
    const existing = await this.repository.findOne(name);
    return existing ? existing.value : undefined;
  }
}
