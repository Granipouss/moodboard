import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

type Action = {
  icon: React.ReactNode;
  label: string;
  run: () => void;
};

export type Props = {
  actions: Action[];
};

export const ActionMenu: React.FC<Props> = ({ actions }) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);

  return (
    <SpeedDial
      ariaLabel="Action Menu"
      className={classes.speedDial}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      direction="left"
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.label}
          icon={action.icon}
          tooltipTitle={action.label}
          onClick={() => {
            action.run();
            setOpen(false);
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default ActionMenu;
