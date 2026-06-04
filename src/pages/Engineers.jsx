import React, { useState } from 'react';
import { Plus, Trash2, Edit, Phone, User, Settings, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createPortal } from 'react-dom';

const Engineers = () => {
  const [showModal, setShowModal] = useState(false);
  const engineers = useLiveQuery(() => db.engineers.toArray());
  const [formData, setFormData] = useState({ name: '', phone: '', specialty: 'ميكانيك', status: 'نشط' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.engineers.add(formData);
    setShowModal(false);
    setFormData({ name: '', phone: '', specialty: 'ميكانيك', status: 'نشط' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المهندس؟')) {
      await db.engineers.delete(id);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">إدارة المهندسين</h1>
          <p className="text-secondary">إضافة وتعديل بيانات الطاقم الفني</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={24} /> إضافة مهندس جديد
        </button>
      </div>

      <div className="grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon"><User size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي المهندسين</h3>
            <p>{engineers?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>رقم الهاتف</th>
                <th>التخصص</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {engineers?.map(eng => (
                <tr key={eng.id}>
                  <td className="font-bold">{eng.name}</td>
                  <td>{eng.phone}</td>
                  <td>{eng.specialty}</td>
                  <td>
                    <span className={`badge ${eng.status === 'نشط' ? 'badge-success' : 'badge-danger'}`}>
                      {eng.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon"><Edit size={18} /></button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(eng.id)}><Trash2 size={18} /></button>
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
              <h2>إضافة مهندس جديد</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">اسم المهندس</label>
                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <input type="text" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">التخصص</label>
                  <select className="form-control" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}>
                    <option>ميكانيك</option>
                    <option>كهرباء</option>
                    <option>فحص فني</option>
                    <option>سمكرة/دهان</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">الحالة</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option>نشط</option>
                    <option>موقوف</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ البيانات</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Engineers;
