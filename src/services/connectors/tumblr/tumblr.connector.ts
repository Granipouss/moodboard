import { Service } from 'typedi';

import { sleep } from '../../../libs/utils';
import {
  ImageRepository,
  ConstantRepository,
} from '../../../services/database';
import { Image } from '../../../entities/image';
import { IConnector } from '../connector.interface';

import { TumblrService } from './tumblr.service';
import { LikeResponse } from './types';

const TOKEN = 'tumblr:token';
const SECRET = 'tumblr:secret';
const CURSOR_BEFORE = 'tumblr:cursor:before';
const CURSOR_AFTER = 'tumblr:cursor:after';

type Dir = 'before' | 'after' | 'begin';

@Service()
export class TumblrConnector implements IConnector {
  constructor(
    private constants: ConstantRepository,
    private images: ImageRepository,
    private service: TumblrService,
  ) {}

  async isActive() {
    return (await this.constants.get(TOKEN)) != null;
  }

  async activate() {
    const { token, secret } = await this.login();
    await Promise.all([
      this.constants.set(TOKEN, token),
      this.constants.set(SECRET, secret),
    ]);
    await sleep(1e3);
    // Non blocking
    this.resumeCollection();
  }

  async resumeCollection() {
    const [token, secret, cursorAfter, cursorBefore] = await Promise.all([
      this.constants.get(TOKEN),
      this.constants.get(SECRET),
      this.constants.get(CURSOR_AFTER),
      this.constants.get(CURSOR_BEFORE),
    ]);

    if (!token || !secret) throw new Error('[TUMBLR] No token');
    this.service.autoLogin({ token, secret });

    if (!cursorAfter || !cursorBefore) {
      await this.beginCollection();
      await this.collectBefore();
    } else {
      await this.collectAfter();
      await this.collectBefore();
    }
  }

  beginCollection() {
    return this.collect('begin');
  }

  async collectAfter() {
    let currentCursor = await this.constants.get(CURSOR_AFTER);
    do {
      const { count, cursor } = await this.collect('after', currentCursor);
      currentCursor = count > 0 ? cursor : undefined;
    } while (currentCursor != null);
  }

  async collectBefore() {
    let currentCursor = await this.constants.get(CURSOR_BEFORE);
    do {
      const { count, cursor } = await this.collect('before', currentCursor);
      currentCursor = count > 0 ? cursor : undefined;
    } while (currentCursor != null);
  }

  async collect(direction: Dir, cursor?: string) {
    // eslint-disable-next-line no-console
    console.log(`[TUMBLR] Collection ${direction} with cursor: ${cursor}`);

    const options = cursor ? JSON.parse(cursor) : undefined;
    const response: LikeResponse = await this.service.getLikes(options);
    const likes = response.liked_posts;
    const count = response.liked_count;
    const links = response._links;

    await Promise.all(
      likes.map(like => {
        if (like.type !== 'photo') return; // eslint-disable-line array-callback-return
        const images = like.photos.map((photo, i) => {
          const image = new Image();
          image.id = `T.${like.id}.${i}`;
          image.source = 'tumblr';
          image.height = photo.original_size.height;
          image.width = photo.original_size.width;
          image.url = photo.original_size.url;
          image.link = like.post_url;
          return image;
        });
        return this.images.save(images);
      }),
    );

    if (!links) {
      return { count, cursor: undefined };
    }

    if (direction === 'begin' || direction === 'before') {
      await this.constants.set(
        CURSOR_BEFORE,
        JSON.stringify(links.next.query_params),
      );
    }
    if (direction === 'begin' || direction === 'after') {
      await this.constants.set(
        CURSOR_AFTER,
        JSON.stringify(links.prev.query_params),
      );
    }

    return {
      count,
      cursor: JSON.stringify(
        direction === 'after'
          ? links.prev.query_params
          : links.next.query_params,
      ),
    };
  }

  login() {
    return this.service.login();
  }

  isLogged() {
    return this.service.isLogged;
  }
}
