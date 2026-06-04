import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, Shield, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const users = useLiveQuery(() => db.users.toArray());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'مدير النظام (Admin)',
    status: 'نشط'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.users.add({
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      status: formData.status
    });
    setShowModal(false);
    setFormData({ name: '', phone: '', password: '', role: 'مدير النظام (Admin)', status: 'نشط' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      await db.users.delete(id);
    }
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>إدارة المستخدمين</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>التحكم في صلاحيات الوصول وحسابات الموظفين</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          <Plus size={24} /> إضافة مستخدم جديد
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>اسم المستخدم</th>
                <th>رقم الهاتف/البريد</th>
                <th>الدور (الصلاحية)</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {user.role.includes('مدير') && <Shield size={16} className="text-primary"/>}
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={user.status === 'نشط' ? 'text-success' : 'text-danger'}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" title="تعديل"><Edit size={18} className="text-warning" /></button>
                      <button className="btn-icon" title="إيقاف/حذف" onClick={() => handleDelete(user.id)}><Trash2 size={18} className="text-danger" /></button>
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
              <h2>مستخدم جديد</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">الاسم الكامل</label>
                  <input type="text" className="form-control" placeholder="اسم الموظف..." required 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف / البريد</label>
                    <input type="text" className="form-control" required
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">كلمة المرور</label>
                    <input type="password" className="form-control" required
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">الصلاحية (الدور)</label>
                  <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option>مدير النظام (Admin)</option>
                    <option>كاشير/محاسب</option>
                    <option>مهندس/فاحص</option>
                    <option>موظف الحجوزات/الشحن</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={formData.status === 'نشط'} 
                      onChange={e => setFormData({...formData, status: e.target.checked ? 'نشط' : 'موقوف'})} 
                      style={{ width: '20px', height: '20px' }} />
                    الحساب نشط
                  </label>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary">حفظ المستخدم</button>
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

export default Users;
