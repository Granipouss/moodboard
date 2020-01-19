import React, { useRef, useEffect } from 'react';
import { LinearProgress, makeStyles, createStyles } from '@material-ui/core';

import { useIsVisible } from '../../hooks/useIsVisible';
import { useLoadMoreImages } from '../../hooks/useImages';

import { LOAD_THRESHOLD, GRID_COLS } from './constants';

const useStyles = makeStyles(() =>
  createStyles({
    loadTrigger: {
      paddingTop: LOAD_THRESHOLD,
      marginTop: -LOAD_THRESHOLD,
    },
  }),
);

export const LoadTrigger: React.FC = () => {
  const classes = useStyles();

  const loadMore = useLoadMoreImages();

  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);
  useEffect(() => {
    if (isVisible) loadMore(2 * GRID_COLS);
  });

  return (
    <div ref={ref} className={classes.loadTrigger}>
      <LinearProgress />
    </div>
  );
};

export default LoadTrigger;
