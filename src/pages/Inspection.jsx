import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Bell, Printer, X, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Inspection = () => {
  const [showModal, setShowModal] = useState(false);
  const inspections = useLiveQuery(() => db.inspections.toArray());

  const [formData, setFormData] = useState({
    examiner: 'أحمد الفاحص',
    pointNo: '',
    type: '',
    customer: '',
    phone: '',
    plate: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    amount: '',
    paymentMethod: 'نقداً'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    // Add inspection record
    await db.inspections.add({
      examiner: formData.examiner,
      pointNo: formData.pointNo,
      type: formData.type,
      customer: formData.customer,
      phone: formData.phone,
      plate: formData.plate,
      startDate: formData.startDate,
      endDate: formData.endDate,
      amount: amount,
      paymentMethod: formData.paymentMethod,
      status: 'ساري'
    });

    // Auto-sync with Wallet
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;
    
    const isCash = formData.paymentMethod === 'نقداً';
    await db.transactions.add({
      receiptNo: `#INSP-${Math.floor(Math.random() * 10000)}`,
      type: `فحص دوري (${formData.type})`,
      credit: isCash ? amount : 0,
      debit: isCash ? 0 : amount,
      balance: isCash ? currentBalance + amount : currentBalance - amount,
      point: 'الفحص الإلكتروني',
      user: formData.examiner,
      date: formData.startDate,
      customer: formData.customer,
      phone: formData.phone
    });
    
    setShowModal(false);
    setFormData({
      examiner: 'أحمد الفاحص', pointNo: '', type: '', customer: '', phone: '', plate: '', 
      startDate: new Date().toISOString().split('T')[0], endDate: '', amount: '', paymentMethod: 'نقداً'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('إلغاء هذا الفحص؟')) {
      await db.inspections.delete(id);
    }
  };

  // Count expiring soon (dummy logic for example)
  const expiringCount = inspections?.filter(i => i.status !== 'منتهي').length || 0;

  return (
    <div>
      <div className="flex-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>الفحص الإلكتروني الدوري</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> تسجيل فحص جديد
        </button>
      </div>

      <div className="card mb-6" style={{ borderColor: 'var(--warning-color)' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--warning-color)' }}>
            <Bell size={24} />
            <h3 style={{ margin: 0 }}>تنبيهات الفحص الدوري</h3>
          </div>
          <span style={{ backgroundColor: 'var(--warning-color)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
            {expiringCount} مركبات اقترب موعدها
          </span>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>رقم النقطة</th>
                <th>اسم العميل</th>
                <th>رقم اللوحة</th>
                <th>الفاحص</th>
                <th>نوع الفحص</th>
                <th>تاريخ الفحص</th>
                <th>تاريخ الانتهاء</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {inspections?.map(insp => (
                <tr key={insp.id}>
                  <td>{insp.pointNo}</td>
                  <td>{insp.customer}</td>
                  <td>{insp.plate}</td>
                  <td>{insp.examiner}</td>
                  <td>{insp.type}</td>
                  <td>{insp.startDate}</td>
                  <td>{insp.endDate}</td>
                  <td>
                    <span className={new Date(insp.endDate) < new Date() ? 'text-danger' : 'text-success'}>
                      {new Date(insp.endDate) < new Date() ? 'منتهي' : 'ساري'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" title="طباعة تقرير"><Printer size={18}/></button>
                      <button className="btn-icon" title="حذف" onClick={() => handleDelete(insp.id)}><Trash2 size={18} className="text-danger" /></button>
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
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>تسجيل فحص جديد</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit}>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">اسم الفاحص</label>
                    <select className="form-control" value={formData.examiner} onChange={e => setFormData({...formData, examiner: e.target.value})}>
                      <option>أحمد الفاحص</option>
                      <option>سعيد المهندس</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم النقطة</label>
                    <input type="text" className="form-control" required value={formData.pointNo} onChange={e => setFormData({...formData, pointNo: e.target.value})} />
                  </div>
                </div>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">نوع الفحص</label>
                    <input type="text" className="form-control" placeholder="فحص دوري، فحص شامل..." required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">اسم العميل</label>
                    <input type="text" className="form-control" required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                  </div>
                </div>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم لوحة الباص</label>
                    <input type="text" className="form-control" required value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} />
                  </div>
                </div>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">تاريخ بدء الفحص</label>
                    <input type="date" className="form-control" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">تاريخ الانتهاء (للتنبيه)</label>
                    <input type="date" className="form-control" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
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
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'inherit' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3b82f6', color: 'white' }}>حفظ وترحيل</button>
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

export default Inspection;
