import React, { useReducer, useRef, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  GridList,
  GridListTile,
  LinearProgress,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { clamp } from '../libs/utils';
import { useSize } from '../hooks/useSize';
import { useKey, useKeys } from '../hooks/useKey';
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

type Dir = 'up' | 'down' | 'left' | 'right';

const cursorMoveReducer = (maxRef: { current: number }) => (
  current: number,
  move: number | Dir,
) => {
  const bounds = [0, maxRef.current - COLS] as const;
  if (typeof move === 'number') {
    // Absolute move
    return clamp(move, bounds);
  } else {
    // Relative move
    let x = current % COLS;
    let y = (current - x) / COLS;
    if (move === 'left') x = (x + COLS - 1) % COLS;
    if (move === 'right') x = (x + 1) % COLS;
    if (move === 'down') y += 1;
    if (move === 'up') y -= 1;
    return clamp(x + y * COLS, bounds);
  }
};

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

  const imageCountRef = useRef(0);
  useEffect(() => {
    imageCountRef.current = images.length;
  }, [images]);

  const params = useParams<{ index?: string }>();
  const [cursor, moveCursor] = useReducer(
    cursorMoveReducer(imageCountRef),
    Number(params.index || 0),
  );

  // Disable arrow scroll
  useKeys(event => {
    if (event.key.match(/^arrow/i) != null) {
      event.preventDefault();
    }
  });

  useKey('ArrowRight', () => moveCursor('right'));
  useKey('ArrowLeft', () => moveCursor('left'));
  useKey('ArrowDown', () => moveCursor('down'));
  useKey('ArrowUp', () => moveCursor('up'));

  const firstScrollRef = useRef(true);
  const tileRefs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    // Wait for height computation
    if (!tileHeight) return;

    // Do nothing if no DOM element
    const tile = tileRefs.current[cursor];
    if (!tile) return;

    // Scroll to element
    // Instant at first then smooth
    tile.scrollIntoView({
      behavior: firstScrollRef.current ? 'auto' : 'smooth',
      block: 'center',
    });
    firstScrollRef.current = false;
  }, [cursor, tileHeight]);

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

  useKey('Enter', () => history.replace(`/view/${cursor}`), [cursor]);

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
