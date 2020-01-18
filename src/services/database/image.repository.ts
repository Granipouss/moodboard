import { Service } from 'typedi';
import { Not, Like, Repository } from 'typeorm';

import { Image } from '../../entities/image';
import { Database } from './database';

@Service()
export class ImageRepository {
  private repositoryPromise: Promise<Repository<Image>>;
  constructor(database: Database) {
    this.repositoryPromise = database.getRepository(Image);
  }

  async getRandom(count: number): Promise<Image[]> {
    const repository = await this.repositoryPromise;
    return repository
      .createQueryBuilder()
      .where({ url: Not(Like('%.gif')) })
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();
  }

  async save(images: Image[]): Promise<void> {
    const repository = await this.repositoryPromise;
    repository.save(images);
  }
}
