import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Download, Printer, X, Trash2, Edit } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Wallet = () => {
  const [showModal, setShowModal] = useState(false);
  const transactions = useLiveQuery(() => db.transactions.toArray());

  const [formData, setFormData] = useState({
    point: 'جوالي',
    pointNo: '',
    customer: '',
    amount: '',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    // Get last balance
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;
    
    await db.transactions.add({
      receiptNo: `#REC-${Math.floor(Math.random() * 10000)}`,
      type: 'شحن محفظة / إيداع',
      credit: amount,
      debit: 0,
      balance: currentBalance + amount,
      point: formData.point,
      user: 'أحمد المدير',
      date: formData.date,
      customer: formData.customer,
      phone: formData.phone
    });
    
    setShowModal(false);
    setFormData({ point: 'جوالي', pointNo: '', customer: '', amount: '', phone: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = async (id) => {
    if (window.confirm('إلغاء هذا القيد المالي؟')) {
      await db.transactions.delete(id);
    }
  };

  const totalBalance = transactions?.length ? transactions[transactions.length - 1].balance : 0;
  const totalCommissions = 25000; // static for now
  const totalDebts = 150000; // static for now

  return (
    <div>
      <div className="flex-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>المحفظة المالية</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <Download size={18} /> تصدير
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> إضافة عملية جديدة
          </button>
        </div>
      </div>

      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-content">
            <h3>الرصيد الإجمالي</h3>
            <p className="text-success">{totalBalance.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>إجمالي الديون</h3>
            <p className="text-danger">{totalDebts.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>السيولة النقدية</h3>
            <p>{(totalBalance - totalDebts).toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>إجمالي العمولات</h3>
            <p className="text-success">{totalCommissions.toLocaleString()} ريال</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between mb-4">
          <h3>سجل العمليات المالي</h3>
          <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>سحب العمولة</button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>رقم السند</th>
                <th>نوع العملية</th>
                <th>دائن</th>
                <th>مدين</th>
                <th>الرصيد</th>
                <th>نقطة الدفع</th>
                <th>المستخدم</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.receiptNo}</td>
                  <td>{tx.type}</td>
                  <td className="text-success">{tx.credit ? tx.credit.toLocaleString() : '-'}</td>
                  <td className="text-danger">{tx.debit ? tx.debit.toLocaleString() : '-'}</td>
                  <td style={{ fontWeight: 'bold' }}>{tx.balance.toLocaleString()}</td>
                  <td>{tx.point}</td>
                  <td>{tx.user}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" title="طباعة"><Printer size={18}/></button>
                      <button className="btn-icon" title="تعديل"><Edit size={18} className="text-warning" /></button>
                      <button className="btn-icon" title="حذف/إلغاء" onClick={() => handleDelete(tx.id)}><Trash2 size={18} className="text-danger" /></button>
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
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>عملية مالية جديدة (نقطة دفع)</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group mb-4">
                    <label className="form-label">ربط حساب (نوع المحفظة)</label>
                    <select className="form-control" value={formData.point} onChange={e => setFormData({...formData, point: e.target.value})}>
                      <option>جوالي</option>
                      <option>حبيب</option>
                      <option>ون كاش</option>
                      <option>نقد - الصندوق</option>
                    </select>
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">رقم النقطة</label>
                    <input type="text" className="form-control" placeholder="أدخل رقم النقطة..." required value={formData.pointNo} onChange={e => setFormData({...formData, pointNo: e.target.value})} />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">العميل</label>
                  <input type="text" className="form-control" placeholder="اسم العميل..." required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                </div>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">المبلغ</label>
                    <input type="number" className="form-control" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" placeholder="77XXXXXXX" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">التاريخ</label>
                  <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">المرفقات (صورة الحوالة)</label>
                  <input type="file" className="form-control" accept="image/*" />
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'inherit' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3b82f6', color: 'white' }}>حفظ العملية</button>
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

export default Wallet;
