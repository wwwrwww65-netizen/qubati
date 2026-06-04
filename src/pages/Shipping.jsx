import React, { useState } from 'react';
import { Plus, Trash2, Printer, Package, X, CheckCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createPortal } from 'react-dom';

const Shipping = () => {
  const [showModal, setShowModal] = useState(false);
  const shippingRecords = useLiveQuery(() => db.shipping.toArray());

  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    itemType: '',
    quantity: 1,
    amount: '',
    immediateDelivery: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const receiptNo = `SHP-${Date.now().toString().slice(-6)}`;
    const record = {
      ...formData,
      receiptNo,
      date: new Date().toISOString(),
      status: 'في الانتظار'
    };

    await db.shipping.add(record);

    // Sync with wallet
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;
    const amount = parseFloat(formData.amount);

    await db.transactions.add({
      receiptNo,
      type: `بوليصة شحن (${formData.itemType})`,
      credit: amount,
      debit: 0,
      balance: currentBalance + amount,
      point: 'قسم الشحن',
      user: 'أحمد المدير',
      date: record.date,
      customer: formData.senderName,
      phone: formData.senderPhone
    });

    setShowModal(false);
    setFormData({
      senderName: '', senderPhone: '', receiverName: '', receiverPhone: '',
      itemType: '', quantity: 1, amount: '', immediateDelivery: false
    });
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">المراسلات والشحن اللوجستي</h1>
          <p className="text-secondary">إدارة بوالص الشحن والتوصيل الفوري</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={24} /> إنشاء بوليصة شحن
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>رقم البوليصة</th>
                <th>المرسل</th>
                <th>المستلم</th>
                <th>نوع الشحنة</th>
                <th>المبلغ</th>
                <th>توصيل فوري</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {shippingRecords?.map(item => (
                <tr key={item.id}>
                  <td className="font-bold">{item.receiptNo}</td>
                  <td>{item.senderName} <br/><small>{item.senderPhone}</small></td>
                  <td>{item.receiverName} <br/><small>{item.receiverPhone}</small></td>
                  <td>{item.itemType} ({item.quantity})</td>
                  <td className="text-success font-bold">{item.amount} ريال</td>
                  <td>{item.immediateDelivery ? <span className="badge badge-success">نعم</span> : 'لا'}</td>
                  <td><span className="badge badge-warning">{item.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon"><Printer size={18} /></button>
                      <button className="btn-icon text-danger"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>إنشاء بوليصة شحن جديدة</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">اسم المرسل</label>
                  <input type="text" className="form-control" required value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">هاتف المرسل</label>
                  <input type="text" className="form-control" required value={formData.senderPhone} onChange={e => setFormData({...formData, senderPhone: e.target.value})} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">اسم المستلم</label>
                  <input type="text" className="form-control" required value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">هاتف المستلم</label>
                  <input type="text" className="form-control" required value={formData.receiverPhone} onChange={e => setFormData({...formData, receiverPhone: e.target.value})} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">نوع الشحنة</label>
                  <input type="text" className="form-control" placeholder="طرد، وثائق، إلخ" required value={formData.itemType} onChange={e => setFormData({...formData, itemType: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">الكمية</label>
                  <input type="number" className="form-control" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">المبلغ الإجمالي</label>
                <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="immediate" checked={formData.immediateDelivery} onChange={e => setFormData({...formData, immediateDelivery: e.target.checked})} />
                <label htmlFor="immediate" className="form-label" style={{ marginBottom: 0 }}>تفعيل طلب توصيل فوري</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ وطباعة البوليصة</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Shipping;
