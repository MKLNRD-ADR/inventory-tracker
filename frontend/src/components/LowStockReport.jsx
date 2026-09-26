import { useEffect, useState } from 'react';
import { Table, message, Tag } from 'antd';
import api from '../api/axios';

function LowStockReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items/report/low-stock');
      setItems(res.data);
    } catch (err) {
      message.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty) => <Tag color="red">{qty}</Tag>,
    },
    { title: 'Threshold', dataIndex: 'low_stock_threshold', key: 'low_stock_threshold' },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={items}
      loading={loading}
      locale={{ emptyText: 'No low stock items — all good!' }}
    />
  );
}

export default LowStockReport;