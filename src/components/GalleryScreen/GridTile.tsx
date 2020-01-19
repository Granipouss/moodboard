import React, { forwardRef } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { Image } from '../../entities/image';
import { GRID_COLS } from './constants';

type Props = {
  image: Image;
  selected: boolean;
  onClick: () => void;
};

const useStyles = makeStyles<Theme, Props>(() =>
  createStyles({
    root: ({ selected }) => ({
      position: 'relative',
      width: `${100 / GRID_COLS}%`,
      paddingTop: `${100 / GRID_COLS}%`,
      cursor: 'pointer',
      border: selected ? `1px solid white` : ``,
    }),
    background: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  }),
);

export const GridTile = forwardRef<HTMLLIElement, Props>((props, ref) => {
  const classes = useStyles(props);
  const { image, onClick } = props;

  return (
    <li ref={ref} className={classes.root} onClick={onClick}>
      <img src={image.url} alt={image.id} className={classes.background} />
    </li>
  );
});

export default GridTile;
