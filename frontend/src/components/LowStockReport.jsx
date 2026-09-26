import { useCallback, useEffect, useState } from 'react';
import { App as AntdApp, Table, Tag, Button, Input, Select, Space } from 'antd';
import api from '../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function LowStockReport({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const { message } = AntdApp.useApp();

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/items/report/low-stock');
      setItems(res.data);
    } catch {
      message.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReport();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchReport, refreshKey]);

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  const filteredItems = items.filter((item) => {
    const searchValue = searchText.trim().toLowerCase();
    const matchesSearch = !searchValue
      || item.name?.toLowerCase().includes(searchValue)
      || item.sku?.toLowerCase().includes(searchValue);
    const matchesCategory = !categoryFilter || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Low Stock Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'SKU', 'Category', 'Quantity', 'Threshold']],
      body: filteredItems.map((item) => [
        item.name,
        item.sku,
        item.category || '-',
        item.quantity,
        item.low_stock_threshold,
      ]),
    });
    doc.save('low-stock-report.pdf');
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
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
      <Space wrap style={{ marginBottom: 16 }}>
        <Button onClick={downloadPDF} disabled={filteredItems.length === 0}>
          Download PDF
        </Button>
        <Input
          allowClear
          placeholder="Search name or SKU"
          id="low-stock-search"
          name="low-stock-search"
          autoComplete="off"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          style={{ width: 220 }}
        />
        <Select
          allowClear
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categories.map((category) => ({ label: category, value: category }))}
          style={{ width: 180 }}
        />
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredItems}
        loading={loading}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'No low stock items — all good!' }}
        pagination={{ placement: ['bottomCenter'] }}
      />
    </>
  );
}

export default LowStockReport;
