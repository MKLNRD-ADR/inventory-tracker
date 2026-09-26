import { useEffect, useState } from 'react';
import { Table, Button, message, Space, Popconfirm, Input, Select } from 'antd';
import api from '../api/axios';
import ItemFormModal from './ItemFormModal';

function ItemTable({ onDataChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(undefined);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch {
      message.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      message.success('Item deleted');
      fetchItems();
      onDataChange?.();
    } catch {
      message.error('Failed to delete item');
    }
  };

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

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'center' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => `₱${Number(price).toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space wrap style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openAddModal}>
          Add Item
        </Button>
        <Input
          allowClear
          placeholder="Search name or SKU"
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
        pagination={{ position: ['bottomCenter'] }}
      />
      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchItems();
          onDataChange?.();
        }}
        editingItem={editingItem}
      />
    </>
  );
}

export default ItemTable;
