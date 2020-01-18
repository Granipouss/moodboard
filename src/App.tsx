import React, { lazy, Suspense, useEffect } from 'react';

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ImageProvider } from './hooks/useImages';
import { withProps, nest } from './libs/hocUtils';
import { resumeCollection } from './libs/connectorUtils';
import Loader from './components/Loader';
import { GlobalStyleProvider } from './components/GlobalStyleProvider';

const Routes = {
  '/connectors': () => import('./components/ConnectorScreen'),
  '/gallery/:index?': () => import('./components/GalleryScreen'),
  '/view/:index': () => import('./components/FullViewScreen'),
};

const App: React.FC = nest(
  GlobalStyleProvider,
  ImageProvider,
  Router,
  withProps(Suspense, { fallback: <Loader /> }),
  () => {
    useEffect(() => {
      resumeCollection();
    }, []);

    return (
      <Switch>
        {Object.entries(Routes).map(([path, factory]) => (
          <Route key={path} path={path} component={lazy(factory)} />
        ))}
        <Route>
          <Redirect to="/gallery" />
        </Route>
      </Switch>
    );
  },
);

export default App;
