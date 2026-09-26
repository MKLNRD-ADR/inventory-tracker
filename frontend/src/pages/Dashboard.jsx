import { Layout, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ItemTable from '../components/ItemTable';

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>Inventory Tracker</Title>
        <Button onClick={handleLogout}>Log Out</Button>
      </Header>
      <Content style={{ padding: '24px' }}>
        <ItemTable />
      </Content>
    </Layout>
  );
}

export default Dashboard;