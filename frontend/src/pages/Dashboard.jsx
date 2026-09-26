import { Layout, Typography, Button, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import ItemTable from '../components/ItemTable';
import LowStockReport from '../components/LowStockReport';

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabItems = [
    { key: 'items', label: 'Items', children: <ItemTable /> },
    { key: 'report', label: 'Low Stock Report', children: <LowStockReport /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Inventory Tracker
        </Title>

        <Button onClick={handleLogout}>Log Out</Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Tabs items={tabItems} />
        </div>
      </Content>
    </Layout>
  );
}

export default Dashboard;