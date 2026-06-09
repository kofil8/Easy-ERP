import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';
import useLanguage from '@/locale/useLanguage';

const { Header } = Layout;

export default function HeaderContainer() {
  const translate = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: appState, appContextAction } = useAppContext();
  const { navMenu } = appContextAction;

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

  const pageTitle = (() => {
    const path = location.pathname;
    if (path.startsWith('/invoice')) return translate('Invoice');
    if (path.startsWith('/customer')) return translate('Customer');
    if (path.startsWith('/payment')) return translate('Payment');
    if (path.startsWith('/quote')) return translate('Quote');
    if (path.startsWith('/settings')) return translate('Settings');
    if (path.startsWith('/profile')) return translate('Profile');
    return translate('Dashboard');
  })();

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={handleToggle}
          style={{ fontSize: 18 }}
        />
        <h3
          style={{
            margin: 0,
            color: '#22075e',
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          {pageTitle}
        </h3>
      </div>

      <Space size="middle" align="center">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
        />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            style={{
              backgroundColor: '#1677ff',
              cursor: 'pointer',
            }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </Header>
  );
}
