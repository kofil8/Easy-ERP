import { useState } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
  DashboardOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';
import useLanguage from '@/locale/useLanguage';

const { Sider } = Layout;

export default function NavigationContainer() {
  const translate = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state: appState, appContextAction } = useAppContext();
  const { isNavMenuClose } = appState;
  const { navMenu } = appContextAction;
  const selectedKey =
    location.pathname === '/'
      ? '/'
      : `/${location.pathname.split('/').filter(Boolean)[0]}`;

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: translate('Dashboard'),
      onClick: () => navigate('/'),
    },
    {
      key: '/customer',
      icon: <CustomerServiceOutlined />,
      label: translate('Customer'),
      onClick: () => navigate('/customer'),
    },
    {
      key: '/invoice',
      icon: <FileTextOutlined />,
      label: translate('Invoice'),
      onClick: () => navigate('/invoice'),
    },
    {
      key: '/payment',
      icon: <CalculatorOutlined />,
      label: translate('Payment'),
      onClick: () => navigate('/payment'),
    },
    {
      key: '/quote',
      icon: <FileTextOutlined />,
      label: translate('Quote'),
      onClick: () => navigate('/quote'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: translate('Settings'),
      onClick: () => navigate('/settings'),
    },
  ];

  const handleToggle = () => {
    navMenu.collapse();
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: translate('Profile'),
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: translate('Logout'),
      icon: <LogoutOutlined />,
      onClick: () => navigate('/logout'),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={isNavMenuClose}
      onCollapse={handleToggle}
      trigger={null}
      width={220}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {isNavMenuClose ? 'ERP' : 'Easy ERP'}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Dropdown menu={{ items: userMenuItems }} placement="topRight">
          <Button
            type="text"
            icon={isNavMenuClose ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ color: '#fff' }}
          />
        </Dropdown>
      </div>
    </Sider>
  );
}
