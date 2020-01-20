import React, { forwardRef } from 'react';
import { makeStyles, createStyles, Backdrop } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      listStyle: 'none',
    },
  }),
);

export const GridContainer = forwardRef<
  HTMLUListElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  const classes = useStyles();

  return (
    <>
      <Backdrop open style={{ zIndex: 1 }} />
      <ul className={classes.root} ref={ref}>
        {children}
      </ul>
    </>
  );
});

export default GridContainer;
