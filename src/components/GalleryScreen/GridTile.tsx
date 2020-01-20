import React, { useRef, forwardRef } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  Grow,
  Paper,
} from '@material-ui/core';

import { Image } from '../../entities/image';
import { useSize } from '../../hooks/useSize';

import { GRID_COLS } from './constants';

type Props = {
  image: Image;
  selected: boolean;
  onClick: () => void;
};

const useStyles = makeStyles<Theme, Props>(theme =>
  createStyles({
    root: {
      position: 'relative',
      width: `${100 / GRID_COLS}%`,
      paddingTop: `${100 / GRID_COLS}%`,
      cursor: 'pointer',
    },
    background: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    centerPopOver: {
      position: 'absolute',
      zIndex: 1,
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
    },
    paper: {
      overflow: 'hidden',
    },
    popOverImageFullHeight: {
      display: 'block',
      height: `calc(${100 / GRID_COLS}vw + ${theme.spacing(1)}px)`,
    },
    popOverImageFullWidth: {
      display: 'block',
      width: `calc(${100 / GRID_COLS}vw + ${theme.spacing(1)}px)`,
    },
  }),
);

export const GridTile = forwardRef<HTMLLIElement, Props>((props, ref) => {
  const classes = useStyles(props);
  const { image, selected, onClick } = props;

  const imageRef = useRef<HTMLImageElement>(null);
  const { width, height } = useSize(imageRef);
  const ratio = width / height;

  return (
    <li ref={ref} className={classes.root} onClick={onClick}>
      <img src={image.url} alt={image.id} className={classes.background} />
      <div className={classes.centerPopOver}>
        <Grow in={selected}>
          <Paper elevation={4} className={classes.paper}>
            <img
              ref={imageRef}
              src={image.url}
              alt={image.id}
              className={
                ratio > 1
                  ? classes.popOverImageFullHeight
                  : classes.popOverImageFullWidth
              }
            />
          </Paper>
        </Grow>
      </div>
    </li>
  );
});

export default GridTile;
