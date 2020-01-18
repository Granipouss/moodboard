import { useCallback } from 'react';

import { Image } from '../entities/image';

import { createStateContext } from '../libs/createStateContext';
import { ImageRepository } from '../services/database';

import { useService } from './useService';

const [useImageList, ImageProvider] = createStateContext<Image[]>([]);

export const useImages = () => {
  const [images] = useImageList();
  return images;
};

let isLoadingMore = false;
export const useLoadMoreImages = () => {
  const repository = useService(ImageRepository);
  const [, setImages] = useImageList();

  return useCallback(
    async (count: number) => {
      if (isLoadingMore) return;
      isLoadingMore = true;
      const newImages = await repository.getRandom(count);
      setImages(oldImages => [...oldImages, ...newImages]);
      isLoadingMore = false;
    },
    [repository, setImages],
  );
};

export { ImageProvider };
