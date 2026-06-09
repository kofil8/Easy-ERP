import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <div className="authBrand">
          <span className="authLogoMark">E</span>
          <span>Easy ERP</span>
        </div>

        <Title level={1} style={{ fontSize: 28 }}>
          Manage your business with clarity
        </Title>
        <Text>
          Customers, invoices, quotes, payments, taxes, and settings in one clean workspace.
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
