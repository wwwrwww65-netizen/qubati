import React, { useState } from 'react';
import { Plus, Trash2, Edit, Truck, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createPortal } from 'react-dom';

const Vehicles = () => {
  const [showModal, setShowModal] = useState(false);
  const vehicles = useLiveQuery(() => db.vehicles.toArray());
  const [formData, setFormData] = useState({ plate: '', type: 'باص همر', model: '', owner: '', status: 'نشط' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.vehicles.add(formData);
    setShowModal(false);
    setFormData({ plate: '', type: 'باص همر', model: '', owner: '', status: 'نشط' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المركبة؟')) {
      await db.vehicles.delete(id);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">إدارة الأسطول</h1>
          <p className="text-secondary">تسجيل وإدارة المركبات والباصات</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={24} /> إضافة مركبة جديدة
        </button>
      </div>

      <div className="grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon"><Truck size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي المركبات</h3>
            <p>{vehicles?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>رقم اللوحة</th>
                <th>النوع</th>
                <th>الموديل</th>
                <th>المالك</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {vehicles?.map(v => (
                <tr key={v.id}>
                  <td className="font-bold">{v.plate}</td>
                  <td>{v.type}</td>
                  <td>{v.model}</td>
                  <td>{v.owner}</td>
                  <td>
                    <span className={`badge ${v.status === 'نشط' ? 'badge-success' : 'badge-danger'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon"><Edit size={18} /></button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(v.id)}><Trash2 size={18} /></button>
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
              <h2>إضافة مركبة جديدة</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">رقم اللوحة</label>
                  <input type="text" className="form-control" required value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">نوع المركبة</label>
                  <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>باص همر</option>
                    <option>باص هايس</option>
                    <option>شاحنة</option>
                    <option>صالون</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">الموديل</label>
                  <input type="text" className="form-control" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">المالك</label>
                  <input type="text" className="form-control" required value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>نشط</option>
                  <option>في الصيانة</option>
                  <option>متوقف</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ المركبة</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Vehicles;
