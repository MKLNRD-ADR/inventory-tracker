import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
    } catch (err) {
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
        background: '#f0f2f5'
      }}
    >
      <Card title="Inventory Tracker Login" style={{ width: 350 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;