import { useEffect, useState } from 'react';
import { App as AntdApp, Modal, Form, Input, InputNumber } from 'antd';
import api from '../api/axios';

function ItemFormModal({ open, onClose, onSuccess, editingItem, existingItems = [] }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { message } = AntdApp.useApp();

  useEffect(() => {
    if (!open) return;

    if (editingItem) {
      form.setFieldsValue(editingItem);
    } else {
      form.resetFields();
    }
  }, [editingItem, form, open]);

  const handleOk = async () => {
    let values;

    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const normalizedSku = String(values.sku).trim().toLowerCase();
    const duplicateSku = existingItems.some((item) =>
      String(item.sku).trim().toLowerCase() === normalizedSku
      && item.id !== editingItem?.id
    );

    if (duplicateSku) {
      const duplicateMessage = 'SKU already exists';
      form.setFields([{ name: 'sku', errors: [duplicateMessage] }]);
      return;
    }

    setSubmitting(true);

    try {

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
      if (err.response?.status === 409) {
        form.setFields([
          {
            name: err.response.data?.field || 'sku',
            errors: [err.response.data?.message || 'SKU already exists']
          }
        ]);
        return;
      }

      message.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const blockNonDigits = (e) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const blockNonDecimal = (e) => {
    if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Modal
      title={editingItem ? 'Edit Item' : 'Add Item'}
      open={open}
      forceRender
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={submitting ? undefined : onClose}
    >
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
          <Input placeholder="e.g. Wireless Mouse" autoComplete="off" />
        </Form.Item>
        <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Please enter a SKU' }]}>
          <Input placeholder="e.g. WM-001" autoComplete="off" />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input placeholder="e.g. Electronics" autoComplete="off" />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter a quantity' }]}>
          <InputNumber style={{ width: '100%' }} min={0} autoComplete="off" onKeyDown={blockNonDigits} />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}>
          <InputNumber style={{ width: '100%' }} min={0} step={0.01} autoComplete="off" onKeyDown={blockNonDecimal} />
        </Form.Item>
        <Form.Item name="low_stock_threshold" label="Low Stock Threshold" initialValue={5}>
          <InputNumber style={{ width: '100%' }} min={0} autoComplete="off" onKeyDown={blockNonDigits} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ItemFormModal;