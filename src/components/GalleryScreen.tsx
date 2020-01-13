import React, { useRef, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  GridList,
  GridListTile,
  LinearProgress,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { useSize } from '../hooks/useSize';
import { useIsVisible } from '../hooks/useIsVisible';
import { useImages, useLoadMoreImages } from '../hooks/useImages';

import ActionMenu from './ActionMenu';

const COLS = 4;
const SPACING = 0;
const THRESHOLD = 400;

const useStyles = makeStyles(() =>
  createStyles({
    loadTrigger: {
      paddingTop: THRESHOLD,
      marginTop: -THRESHOLD,
    },
  }),
);

export const GalleryScreen: React.FC = () => {
  const images = useImages();
  const loadMore = useLoadMoreImages();

  // Load more when at the bottom
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(loadMoreTriggerRef);
  useEffect(() => {
    if (isVisible) loadMore(2 * COLS);
  });

  // Ensure that tiles are squared
  const galleryRef = useRef<HTMLElement>(null);
  const { width } = useSize(galleryRef);
  const tileHeight = (width - 3 * SPACING) / COLS;

  // Scroll image into view when index given
  const tileRefs = useRef<HTMLElement[]>([]);
  const params = useParams<{ index?: string }>();
  const index = params.index != null ? Number(params.index) : undefined;
  useEffect(() => {
    if (index != null) {
      setImmediate(() => {
        const tile = tileRefs.current[index];
        if (tile) {
          tile.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      });
    }
  }, [index]);

  const history = useHistory();
  const actions = useMemo(
    () => [
      {
        icon: <SyncIcon />,
        label: 'Synchronize',
        run: () => history.replace('/connectors'),
      },
    ],
    [history],
  );

  const classes = useStyles();

  return (
    <>
      <GridList
        cellHeight={tileHeight}
        cols={COLS}
        spacing={SPACING}
        ref={galleryRef}
      >
        {images.map((tile, index) => (
          <GridListTile
            ref={el => (tileRefs.current[index] = el as HTMLElement)}
            onClick={() => history.replace(`/view/${index}`)}
            style={{ cursor: 'pointer' }}
            key={index}
          >
            <img src={tile.url} alt={tile.id} />
          </GridListTile>
        ))}
      </GridList>

      <div ref={loadMoreTriggerRef} className={classes.loadTrigger}>
        <LinearProgress />
      </div>

      <ActionMenu actions={actions} />
    </>
  );
};

export default GalleryScreen;
