import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import api from '../api/axios';

function ItemFormModal({ open, onClose, onSuccess, editingItem }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue(editingItem);
    } else {
      form.resetFields();
    }
  }, [editingItem, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await api.put(`/items/${editingItem.id}`, values);
        message.success('Item updated');
      } else {
        await api.post('/items', values);
        message.success('Item created');
      }

      onSuccess();
      onClose();
    } catch (err) {
      if (err.errorFields) return; // form validation error, don't show a message
      message.error('Something went wrong');
    }
  };

  return (
    <Modal
      title={editingItem ? 'Edit Item' : 'Add Item'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
        </Form.Item>
        <Form.Item name="low_stock_threshold" label="Low Stock Threshold" initialValue={5}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ItemFormModal;