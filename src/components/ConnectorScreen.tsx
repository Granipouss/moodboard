import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  createStyles,
  FormGroup,
  Switch,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';

import { TumblrIcon } from './Icons';
import ActionMenu from './ActionMenu';
import { useService } from '../hooks/useService';
import { TumblrConnector } from '../services/connectors/tumblr';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    icon: {
      fontSize: theme.spacing(8),
    },
  }),
);

const TumblrSwitch: React.FC = () => {
  const classes = useStyles({});

  const service = useService(TumblrConnector);
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    service
      .isActive()
      .then(value => setActive(value))
      .catch(); // Never throw
  }, [service]);

  const activate = async () => {
    if (isActive) return;
    await service.activate();
    setActive(await service.isActive());
  };

  return (
    <FormControlLabel
      control={<Switch checked={isActive} onChange={activate} />}
      label={<TumblrIcon className={classes.icon} />}
      labelPlacement="top"
    />
  );
};

const ConnectorScreen: React.FC = () => {
  const classes = useStyles({});

  const history = useHistory();
  const actions = useMemo(
    () => [
      {
        icon: <DashboardIcon />,
        label: 'Gallery',
        run: () => history.replace(`/gallery`),
      },
    ],
    [history],
  );

  return (
    <main className={classes.root}>
      <Typography variant="h4" component="h2" className={classes.title}>
        Choose your sources
      </Typography>

      <FormGroup row>
        <TumblrSwitch />
      </FormGroup>

      <ActionMenu actions={actions} />
    </main>
  );
};

export default ConnectorScreen;
