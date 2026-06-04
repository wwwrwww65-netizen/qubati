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
      <div className="flex-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ورشة الصيانة</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> تسجيل عملية صيانة
        </button>
      </div>

      <div className="card mb-6">
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
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--bg-secondary, #1e293b)',
              color: 'var(--text-primary, #ffffff)',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color, #334155)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color, #334155)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>تسجيل عملية صيانة جديدة</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit}>
                <div className="grid-2 mb-4">
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
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">اسم العميل كامل</label>
                    <input type="text" className="form-control" required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">نوع التغيير / الإصلاح</label>
                  <input type="text" className="form-control" placeholder="تغيير زيت، بواجي..." required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                </div>
                <div className="grid-2 mb-4">
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
                <div className="form-group mb-4">
                  <label className="form-label">مرفقات (صورة القطع/المركبة)</label>
                  <input type="file" className="form-control" accept="image/*" />
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'inherit' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3b82f6', color: 'white' }}>حفظ وترحيل للمحفظة</button>
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
