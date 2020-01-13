import { shell } from 'electron';
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DashboardIcon from '@material-ui/icons/Dashboard';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SyncIcon from '@material-ui/icons/Sync';

import { useImages, useLoadMoreImages } from '../hooks/useImages';

import Loader from './Loader';
import ActionMenu from './ActionMenu';

const PADDING = 4;

const useStyles = makeStyles(theme =>
  createStyles({
    mainImage: {
      display: 'block',
      height: '100vh',
      width: '100vw',
      objectFit: 'contain',
    },
    navigateButton: {
      width: theme.spacing(6),
      position: 'fixed',
      top: 0,
      zIndex: 1,
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Icon
      color: theme.palette.background.paper,
      transition: '200ms ease-in-out',
      opacity: 0.5,
      '&:hover': { opacity: 1 },
      '& .MuiSvgIcon-root': {
        fontSize: '3rem',
      },
    },
  }),
);

const FullViewSreen: React.FC = () => {
  const params = useParams<{ index?: string }>();
  const index = Number(params.index || 0);

  const images = useImages();
  const image = images[index];

  // Load more when reaching padding
  const loadMore = useLoadMoreImages();
  useEffect(() => {
    if (images.length < index + PADDING) {
      loadMore(PADDING);
    }
  }, [images, index, loadMore]);

  const classes = useStyles({});

  const history = useHistory();
  const actions = useMemo(
    () => [
      {
        icon: <DashboardIcon />,
        label: 'Gallery',
        run: () => history.replace(`/gallery/${index}`),
      },
      {
        icon: <OpenInBrowserIcon />,
        label: 'Open',
        run: () => shell.openExternal(image.url),
      },
      {
        icon: <SyncIcon />,
        label: 'Synchronize',
        run: () => history.replace('/connectors'),
      },
    ],
    [history, index, image],
  );

  if (!image) {
    return <Loader />;
  }

  return (
    <div>
      {index > 0 && (
        <Link
          to={`/view/${index - 1}`}
          className={classes.navigateButton}
          style={{ left: 0 }}
        >
          <NavigateBeforeIcon />
        </Link>
      )}
      <img src={image.url} alt={image.id} className={classes.mainImage} />
      <Link
        to={`/view/${index + 1}`}
        className={classes.navigateButton}
        style={{ right: 0 }}
      >
        <NavigateNextIcon />
      </Link>

      <ActionMenu actions={actions} />
    </div>
  );
};

export default FullViewSreen;
