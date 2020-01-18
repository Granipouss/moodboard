import React from 'react';

import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import { withProps, nest } from '../libs/hocUtils';

const darkTheme = createMuiTheme({
  palette: { type: 'dark' },
});

const useGlobalStyles = makeStyles(
  theme => ({
    '@global': {
      body: {
        overflowX: 'hidden',
        overflowY: 'auto',
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.background.paper,
      },
      '::-webkit-scrollbar': {
        width: theme.spacing(0.75),
        backgroundColor: theme.palette.background.paper,
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.common.black,
      },
    },
  }),
  { name: 'MuiCssBaseline' },
);

export const GlobalStyleProvider: React.FC = nest(
  withProps(ThemeProvider, { theme: darkTheme }),
  ({ children }) => {
    useGlobalStyles();
    return (
      <>
        <CssBaseline />
        {children}
      </>
    );
  },
);

export default GlobalStyleProvider;
