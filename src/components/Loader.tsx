import React from 'react';
import { makeStyles, createStyles, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    },
  }),
);

export const Loader: React.FC = () => {
  const classes = useStyles({});

  return (
    <div className={classes.wrapper}>
      <CircularProgress size={80} />
    </div>
  );
};

export default Loader;
