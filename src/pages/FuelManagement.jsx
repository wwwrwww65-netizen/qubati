import React, { useState } from 'react';
import { Fuel, Plus, Trash2, X, MapPin } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createPortal } from 'react-dom';

const FuelManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const fuelLogs = useLiveQuery(() => db.fuelLogs.toArray());
  const vehicles = useLiveQuery(() => db.vehicles.toArray());
  const stations = useLiveQuery(() => db.stations.toArray());

  const [formData, setFormData] = useState({
    busId: '',
    stationId: '',
    quantity: 1, // Number of "Dabbas"
    fuelType: 'بترول',
    paymentType: 'نقد',
    amount: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date().toISOString();
    const record = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      amount: parseFloat(formData.amount),
      date,
      user: 'أحمد المدير'
    };

    await db.fuelLogs.add(record);

    // Sync with wallet
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;
    const amount = parseFloat(formData.amount);

    await db.transactions.add({
      receiptNo: `FUEL-${Date.now().toString().slice(-6)}`,
      type: `سحبيات وقود (${formData.fuelType})`,
      credit: 0,
      debit: amount,
      balance: currentBalance - amount,
      point: 'إدارة الوقود',
      user: 'أحمد المدير',
      date,
      customer: `باص: ${formData.busId}`,
      phone: ''
    });

    setShowModal(false);
    setFormData({ busId: '', stationId: '', quantity: 1, fuelType: 'بترول', paymentType: 'نقد', amount: '' });
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">إدارة الوقود</h1>
          <p className="text-secondary">تسجيل سحبيات الباصات من الوقود (بالدبات)</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={24} /> تسجيل سحب وقود
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الباص (رقم اللوحة)</th>
                <th>المحطة</th>
                <th>الكمية (دبة)</th>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>طريقة الدفع</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {fuelLogs?.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.date).toLocaleDateString('ar-YE')}</td>
                  <td className="font-bold">{log.busId}</td>
                  <td>{log.stationId}</td>
                  <td>{log.quantity} دبة <small>(~{log.quantity * 20} لتر)</small></td>
                  <td>{log.fuelType}</td>
                  <td className="text-danger font-bold">{log.amount.toLocaleString()} ريال</td>
                  <td><span className={`badge ${log.paymentType === 'نقد' ? 'badge-success' : 'badge-warning'}`}>{log.paymentType}</span></td>
                  <td>
                    <button className="btn-icon text-danger"><Trash2 size={18} /></button>
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
              <h2>تسجيل سحب وقود جديد</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">اختر الباص</label>
                  <select className="form-control" required value={formData.busId} onChange={e => setFormData({...formData, busId: e.target.value})}>
                    <option value="">اختر باص...</option>
                    {vehicles?.map(v => <option key={v.id} value={v.plate}>{v.plate} - {v.type}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">المحطة</label>
                  <select className="form-control" required value={formData.stationId} onChange={e => setFormData({...formData, stationId: e.target.value})}>
                    <option value="">اختر محطة...</option>
                    {stations?.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">الكمية (بالدبة - 20 لتر)</label>
                  <input type="number" className="form-control" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">نوع الوقود</label>
                  <select className="form-control" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}>
                    <option>بترول</option>
                    <option>ديزل</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">المبلغ</label>
                  <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">طريقة الدفع</label>
                  <select className="form-control" value={formData.paymentType} onChange={e => setFormData({...formData, paymentType: e.target.value})}>
                    <option>نقد</option>
                    <option>دين / آجل</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ السحب وترحيله للمحفظة</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FuelManagement;
