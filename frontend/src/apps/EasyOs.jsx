import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import PageLoader from '@/components/PageLoader';
import { AppContextProvider } from '@/context/appContext';
import Localization from '@/locale/Localization';
import { selectAuth } from '@/redux/auth/selectors';
import AuthRouter from '@/router/AuthRouter';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <Localization>
    <AppContextProvider>
      <Suspense fallback={<PageLoader />}>
        <ErpApp />
      </Suspense>
    </AppContextProvider>
  </Localization>
);

export default function EasyOs() {
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn)
    return (
      <Localization>
        <AuthRouter />
      </Localization>
    );
  else {
    return <DefaultApp />;
  }
}
