import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Download, Printer, X, Trash2, Edit, Wallet as WalletIcon } from 'lucide-react';
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

  const totalBalance = transactions?.length ? (transactions[transactions.length - 1]?.balance || 0) : 0;
  const totalCommissions = 25000; // static for now
  const totalDebts = 150000; // static for now

  return (
    <div className="fade-in">
      <div className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>المحفظة المالية</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>إدارة الحسابات، الديون، والعمليات المالية</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="btn btn-secondary" title="تصدير">
            <Download size={24} /> <span>تصدير البيانات</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={24} /> <span>إضافة عملية جديدة</span>
          </button>
        </div>
      </div>

      <div className="grid-4 mb-8">
        <div className="stat-card" style={{ '--primary-color': 'var(--success-color)', '--primary-soft': 'var(--success-soft)' }}>
          <div className="stat-icon"><Plus size={32} /></div>
          <div className="stat-content">
            <h3>الرصيد الإجمالي</h3>
            <p className="text-success">{totalBalance.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--primary-color': 'var(--danger-color)', '--primary-soft': 'var(--danger-soft)' }}>
          <div className="stat-icon"><Trash2 size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي الديون</h3>
            <p className="text-danger">{totalDebts.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><WalletIcon size={32} /></div>
          <div className="stat-content">
            <h3>السيولة النقدية</h3>
            <p>{(totalBalance - totalDebts).toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--primary-color': 'var(--warning-color)', '--primary-soft': 'var(--warning-soft)' }}>
          <div className="stat-icon"><Plus size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي العمولات</h3>
            <p className="text-success">{totalCommissions.toLocaleString()} ريال</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between mb-6">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>سجل العمليات المالي</h3>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', background: 'var(--success-color)' }}>سحب العمولة</button>
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>عملية مالية جديدة (نقطة دفع)</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">ربط حساب (نوع المحفظة)</label>
                    <select className="form-control" value={formData.point} onChange={e => setFormData({...formData, point: e.target.value})}>
                      <option>جوالي</option>
                      <option>حبيب</option>
                      <option>ون كاش</option>
                      <option>نقد - الصندوق</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم النقطة</label>
                    <input type="text" className="form-control" placeholder="أدخل رقم النقطة..." required value={formData.pointNo} onChange={e => setFormData({...formData, pointNo: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">العميل</label>
                  <input type="text" className="form-control" placeholder="اسم العميل..." required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">المبلغ</label>
                    <input type="number" className="form-control" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" placeholder="77XXXXXXX" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">التاريخ</label>
                  <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">المرفقات (صورة الحوالة)</label>
                  <div className="file-upload-wrapper">
                    <Download className="file-upload-icon" size={48} />
                    <span className="file-upload-text">اسحب وأفلت الصورة هنا أو انقر للاختيار</span>
                    <span className="file-upload-hint">يدعم PNG, JPG, JPEG (الحد الأقصى 5MB)</span>
                    <input type="file" accept="image/*" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary">حفظ العملية</button>
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
