import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, FileText, X, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Maintenance = () => {
  const [showModal, setShowModal] = useState(false);
  const maintenanceRecords = useLiveQuery(() => db.maintenance.toArray());

  const [formData, setFormData] = useState({
    engineer: 'وليد',
    pointNo: '',
    customer: '',
    phone: '',
    type: '',
    amount: '',
    paymentMethod: 'نقداً',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    // Add maintenance record
    await db.maintenance.add({
      engineer: formData.engineer,
      pointNo: formData.pointNo,
      customer: formData.customer,
      phone: formData.phone,
      type: formData.type,
      amount: amount,
      paymentMethod: formData.paymentMethod,
      date: formData.date
    });

    // Auto-sync with Wallet
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;
    
    // If debt, it doesn't add to balance directly, but let's record it. If cash, it increases balance.
    const isCash = formData.paymentMethod === 'نقداً';
    await db.transactions.add({
      receiptNo: `#MNT-${Math.floor(Math.random() * 10000)}`,
      type: `صيانة ورشة (${formData.type})`,
      credit: isCash ? amount : 0,
      debit: isCash ? 0 : amount,
      balance: isCash ? currentBalance + amount : currentBalance - amount,
      point: 'ورشة الصيانة',
      user: formData.engineer,
      date: formData.date,
      customer: formData.customer,
      phone: formData.phone
    });
    
    setShowModal(false);
    setFormData({
      engineer: 'وليد', pointNo: '', customer: '', phone: '', type: '', amount: '', paymentMethod: 'نقداً', date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
      await db.maintenance.delete(id);
    }
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>ورشة الصيانة</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>إدارة عمليات الإصلاح والصيانة الدورية</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={24} /> تسجيل عملية صيانة
        </button>
      </div>

      <div className="card mb-8">
        <div className="grid-4" style={{ alignItems: 'flex-end' }}>
          <div className="form-group mb-0">
            <label className="form-label">المهندس</label>
            <select className="form-control">
              <option>الكل</option>
              <option>وليد</option>
              <option>خالد</option>
              <option>عبدالله</option>
              <option>عامر</option>
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label">بحث برقم المركبة/الهاتف</label>
            <div style={{ position: 'relative' }}>
              <input type="text" className="form-control" placeholder="بحث..." />
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>رقم النقطة</th>
                <th>اسم العميل</th>
                <th>رقم الهاتف</th>
                <th>المهندس</th>
                <th>نوع الصيانة</th>
                <th>المبلغ</th>
                <th>طريقة الدفع</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceRecords?.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.pointNo}</td>
                  <td>{record.customer}</td>
                  <td>{record.phone}</td>
                  <td>{record.engineer}</td>
                  <td>{record.type}</td>
                  <td>{record.amount.toLocaleString()}</td>
                  <td>
                    <span className={record.paymentMethod === 'نقداً' ? 'text-success' : 'text-danger'}>
                      {record.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" title="طباعة فاتورة"><FileText size={18}/></button>
                      <button className="btn-icon" title="حذف" onClick={() => handleDelete(record.id)}><Trash2 size={18} className="text-danger" /></button>
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
              <h2>تسجيل عملية صيانة جديدة</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">اسم المهندس</label>
                    <select className="form-control" value={formData.engineer} onChange={e => setFormData({...formData, engineer: e.target.value})}>
                      <option>وليد</option>
                      <option>خالد</option>
                      <option>عبدالله</option>
                      <option>عامر</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم النقطة</label>
                    <input type="text" className="form-control" placeholder="مثال: 1003" required value={formData.pointNo} onChange={e => setFormData({...formData, pointNo: e.target.value})} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">اسم العميل كامل</label>
                    <input type="text" className="form-control" required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">نوع التغيير / الإصلاح</label>
                  <input type="text" className="form-control" placeholder="تغيير زيت، بواجي..." required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">المبلغ</label>
                    <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">طريقة الدفع</label>
                    <select className="form-control" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                      <option>نقداً</option>
                      <option>دين</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">مرفقات (صورة القطع/المركبة)</label>
                  <div className="file-upload-wrapper">
                    <Download className="file-upload-icon" size={48} />
                    <span className="file-upload-text">اسحب وأفلت الصور هنا أو انقر للاختيار</span>
                    <span className="file-upload-hint">يمكنك رفع صور القطع أو حالة المركبة</span>
                    <input type="file" accept="image/*" multiple />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary">حفظ وترحيل للمحفظة</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Maintenance;
