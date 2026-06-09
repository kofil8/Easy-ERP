import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';

import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';

import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

export default function ErpCrmApp() {
  const { Content } = Layout;

  const { state: stateApp } = useAppContext();
  const { isNavMenuClose } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);
  const sidebarWidth = isMobile ? 0 : isNavMenuClose ? 80 : 220;

  if (settingIsloaded)
    return (
      <Layout className="erpShell" hasSider={!isMobile}>
        <Navigation />

        <Layout
          className="erpMain"
          style={{
            marginLeft: sidebarWidth,
          }}
        >
          <HeaderContent />
          <Content className="erpContent">
            <AppRouter />
          </Content>
        </Layout>
      </Layout>
    );
  else return <PageLoader />;
}
