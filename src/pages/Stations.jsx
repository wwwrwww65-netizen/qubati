import React, { useState } from 'react';
import { Plus, Trash2, Edit, MapPin, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createPortal } from 'react-dom';

const Stations = () => {
  const [showModal, setShowModal] = useState(false);
  const stations = useLiveQuery(() => db.stations.toArray());
  const [formData, setFormData] = useState({ name: '', location: '', contact: '', status: 'نشط' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.stations.add(formData);
    setShowModal(false);
    setFormData({ name: '', location: '', contact: '', status: 'نشط' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المحطة؟')) {
      await db.stations.delete(id);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">إدارة المحطات</h1>
          <p className="text-secondary">إدارة نقاط الوقود والمحطات المعتمدة</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={24} /> إضافة محطة جديدة
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>اسم المحطة</th>
                <th>الموقع</th>
                <th>رقم التواصل</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {stations?.map(s => (
                <tr key={s.id}>
                  <td className="font-bold">{s.name}</td>
                  <td>{s.location}</td>
                  <td>{s.contact}</td>
                  <td>
                    <span className={`badge ${s.status === 'نشط' ? 'badge-success' : 'badge-danger'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon"><Edit size={18} /></button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(s.id)}><Trash2 size={18} /></button>
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
              <h2>إضافة محطة وقود</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">اسم المحطة</label>
                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">الموقع</label>
                <input type="text" className="form-control" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">رقم التواصل</label>
                <input type="text" className="form-control" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>نشط</option>
                  <option>خارج الخدمة</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ المحطة</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Stations;
