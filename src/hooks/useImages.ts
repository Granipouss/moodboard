import { useCallback } from 'react';

import { Image } from '../entities/image';

import { createStateContext } from '../libs/createStateContext';

import { useService } from './useService';
import { Database } from '../services/database';

const [useImageList, ImageProvider] = createStateContext<Image[]>([]);

export const useImages = () => {
  const [images] = useImageList();
  return images;
};

let isLoadingMore = false;
export const useLoadMoreImages = () => {
  const database = useService(Database);
  const [, setImages] = useImageList();

  return useCallback(
    async (n: number) => {
      if (isLoadingMore) return;
      isLoadingMore = true;
      const newImages = await database.imageRepo.query(`
        SELECT * FROM image
        WHERE url NOT LIKE '%.gif'
        ORDER BY RANDOM()
        LIMIT ${n};
      `);
      setImages(oldImages => [...oldImages, ...newImages]);
      isLoadingMore = false;
    },
    [database, setImages],
  );
};

export { ImageProvider };
