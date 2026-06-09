import { useEffect } from 'react';

import { useLocation, useRoutes } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';

import routes from './routes';

function getAppNameByPath(path) {
  for (let key in routes) {
    for (let i = 0; i < routes[key].length; i++) {
      if (routes[key][i].path === path) {
        return key;
      }
    }
  }

  return 'default';
}

export default function AppRouter() {
  let location = useLocation();
  const { appContextAction } = useAppContext();
  const { app } = appContextAction;

  const routesList = [];

  Object.values(routes).forEach((value) => {
    routesList.push(...value);
  });

  useEffect(() => {
    if (location.pathname === '/') {
      app.default();
    } else {
      const path = getAppNameByPath(location.pathname);
      app.open(path);
    }
  }, [app, location.pathname]);

  let element = useRoutes(routesList);

  return element;
}
