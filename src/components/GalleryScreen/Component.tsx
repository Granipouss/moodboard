import React, { useRef, useEffect, useMemo } from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { useKey } from '../../hooks/useKey';
import { useSize } from '../../hooks/useSize';
import { useImages } from '../../hooks/useImages';
import { useNavigation } from '../../hooks/useNavigation';

import ActionMenu from '../ActionMenu';

import { GRID_COLS, GRID_SPACING } from './constants';
import { useCursorNavigation } from './useCursorNavigation';
import { useScrollControl } from './useScrollControl';
import LoadTrigger from './LoadTrigger';

export const GalleryScreen: React.FC = () => {
  const images = useImages();

  // Ensure that tiles are squared
  const galleryRef = useRef<HTMLElement>(null);
  const { width } = useSize(galleryRef);
  const tileHeight = (width - 3 * GRID_SPACING) / GRID_COLS;

  const navigate = useNavigation();

  const imageCountRef = useRef(0);
  useEffect(() => void (imageCountRef.current = images.length), [images]);

  const cursor = useCursorNavigation(imageCountRef);

  const tileRefs = useRef<(HTMLElement | null)[]>([]);
  useScrollControl(cursor, width, tileRefs);

  const actions = useMemo(
    () => [
      {
        icon: <SyncIcon />,
        label: 'Synchronize',
        run: () => navigate.toConnectors(),
      },
    ],
    [navigate],
  );

  useKey('Enter', () => navigate.toView(cursor), [cursor]);

  return (
    <>
      <GridList
        ref={galleryRef}
        cols={GRID_COLS}
        spacing={GRID_SPACING}
        cellHeight={tileHeight}
      >
        {images.map((tile, index) => (
          <GridListTile
            key={index}
            ref={el => (tileRefs.current[index] = el as HTMLElement)}
            onClick={() => navigate.toView(index)}
            style={{
              cursor: 'pointer',
              border: cursor === index ? `1px solid white` : ``,
            }}
          >
            <img src={tile.url} alt={tile.id} />
          </GridListTile>
        ))}
      </GridList>

      <LoadTrigger />

      <ActionMenu actions={actions} />
    </>
  );
};
