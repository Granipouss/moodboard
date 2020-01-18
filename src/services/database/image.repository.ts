import { Service } from 'typedi';
import { Not, Like, Repository } from 'typeorm';

import { Image } from '../../entities/image';
import { Database } from './database';

@Service()
export class ImageRepository {
  private repository: Repository<Image>;
  constructor(database: Database) {
    this.repository = database.getRepository(Image);
  }

  getRandom(count: number): Promise<Image[]> {
    return this.repository
      .createQueryBuilder()
      .where({ url: Not(Like('%.gif')) })
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();
  }

  save(images: Image[]): Promise<Image[]> {
    return this.repository.save(images);
  }
}
