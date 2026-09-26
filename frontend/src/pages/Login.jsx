import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const { Title, Text } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      localStorage.setItem('token', res.data.token);
      message.success('Logged in successfully');
      navigate('/dashboard');
    } catch {
      message.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Card style={{ width: 340, borderRadius: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>Inventory Tracker</Title>
          <Text type="secondary">Sign in to continue</Text>
        </div>

        <Form onFinish={onFinish} layout="vertical" requiredMark={false}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
