import React, { useState, useEffect } from 'react';
import { CreditCard, Trash2, CheckCircle, X, DollarSign } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createPortal } from 'react-dom';

const BillPayments = () => {
  const [showModal, setShowModal] = useState(false);
  const payments = useLiveQuery(() => db.billPayments.toArray());

  const [formData, setFormData] = useState({
    serviceType: 'يمن موبايل',
    accountNo: '',
    amount: '',
    commission: 100, // Default commission
  });

  // Auto-calculate commission based on service (mock logic)
  useEffect(() => {
    const commissions = {
      'يمن موبايل': 100,
      'سبأفون': 100,
      'YOU': 100,
      'الكهرباء': 500,
      'الماء': 300,
      'المرور': 1000,
      'الجامعات': 2000
    };
    setFormData(prev => ({ ...prev, commission: commissions[prev.serviceType] || 100 }));
  }, [formData.serviceType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const commission = parseFloat(formData.commission);
    const total = amount + commission;
    const date = new Date().toISOString();

    const record = {
      serviceType: formData.serviceType,
      accountNo: formData.accountNo,
      amount,
      commission,
      total,
      user: 'أحمد المدير',
      date
    };

    await db.billPayments.add(record);

    // Sync with wallet
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;

    // The amount goes to service, commission goes to box
    await db.transactions.add({
      receiptNo: `BILL-${Date.now().toString().slice(-6)}`,
      type: `سداد ${formData.serviceType}`,
      credit: commission, // Commission is profit for the office
      debit: 0,
      balance: currentBalance + commission,
      point: 'قسم الخدمات',
      user: 'أحمد المدير',
      date,
      customer: `حساب: ${formData.accountNo}`,
      phone: ''
    });

    setShowModal(false);
    setFormData({ serviceType: 'يمن موبايل', accountNo: '', amount: '', commission: 100 });
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">الخدمات العامة وسداد الفواتير</h1>
          <p className="text-secondary">تسديد فواتير الاتصالات، الخدمات، والرسوم الجامعية</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <CreditCard size={24} /> تنفيذ عملية سداد
        </button>
      </div>

      <div className="grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي العمولات المحصلة</h3>
            <p className="text-success">
              {payments?.reduce((acc, curr) => acc + curr.commission, 0).toLocaleString() || 0} ريال
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الخدمة</th>
                <th>رقم الحساب</th>
                <th>المبلغ</th>
                <th>العمولة</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.date).toLocaleDateString('ar-YE')}</td>
                  <td className="font-bold">{p.serviceType}</td>
                  <td>{p.accountNo}</td>
                  <td>{p.amount.toLocaleString()}</td>
                  <td className="text-success">+{p.commission.toLocaleString()}</td>
                  <td className="font-bold">{p.total.toLocaleString()}</td>
                  <td><span className="badge badge-success">تم السداد</span></td>
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
              <h2>عملية سداد جديدة</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">نوع الخدمة</label>
                <select className="form-control" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
                  <option>يمن موبايل</option>
                  <option>سبأفون</option>
                  <option>YOU</option>
                  <option>الكهرباء</option>
                  <option>الماء</option>
                  <option>المرور</option>
                  <option>الجامعات</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">رقم الحساب / الهاتف</label>
                <input type="text" className="form-control" required value={formData.accountNo} onChange={e => setFormData({...formData, accountNo: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">المبلغ</label>
                  <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">عمولة المكتب (تلقائي)</label>
                  <input type="number" className="form-control" required value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} />
                </div>
              </div>
              <div className="card" style={{ background: 'var(--primary-soft)', border: 'none', textAlign: 'center' }}>
                <p className="text-secondary">المبلغ الإجمالي المطلوب من العميل</p>
                <h2 className="text-primary" style={{ fontSize: '2rem' }}>
                  {(parseFloat(formData.amount || 0) + parseFloat(formData.commission || 0)).toLocaleString()} ريال
                </h2>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">تأكيد السداد</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BillPayments;
