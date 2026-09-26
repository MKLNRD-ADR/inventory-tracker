import { useEffect, useState } from 'react';
import { Table, message, Tag, Button } from 'antd';
import api from '../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function LowStockReport({ refreshKey }) {
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
  }, [refreshKey]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Low Stock Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'SKU', 'Quantity', 'Threshold']],
      body: items.map((item) => [item.name, item.sku, item.quantity, item.low_stock_threshold]),
    });
    doc.save('low-stock-report.pdf');
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (qty) => <Tag color="red">{qty}</Tag>,
    },
    {
      title: 'Threshold',
      dataIndex: 'low_stock_threshold',
      key: 'low_stock_threshold',
      align: 'center',
    },
  ];

  return (
    <>
      <Button onClick={downloadPDF} style={{ marginBottom: 16 }} disabled={items.length === 0}>
        Download PDF
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        locale={{ emptyText: 'No low stock items — all good!' }}
        pagination={{ position: ['bottomCenter'] }}
      />
    </>
  );
}

export default LowStockReport;