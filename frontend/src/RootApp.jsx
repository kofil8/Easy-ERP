import './style/app.css';

import PageLoader from '@/components/PageLoader';
import store from '@/redux/store';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const EasyOs = lazy(() => import('./apps/EasyOs'));

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <EasyOs />
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}
