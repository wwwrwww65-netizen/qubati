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
      <div className="flex-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>إدارة المستخدمين والصلاحيات</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> إضافة مستخدم جديد
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
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>مستخدم جديد</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label className="form-label">الاسم الكامل</label>
                  <input type="text" className="form-control" placeholder="اسم الموظف..." required 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid-2 mb-4">
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
                <div className="form-group mb-4">
                  <label className="form-label">الصلاحية (الدور)</label>
                  <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option>مدير النظام (Admin)</option>
                    <option>كاشير/محاسب</option>
                    <option>مهندس/فاحص</option>
                    <option>موظف الحجوزات/الشحن</option>
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500' }}>
                    <input type="checkbox" checked={formData.status === 'نشط'} 
                      onChange={e => setFormData({...formData, status: e.target.checked ? 'نشط' : 'موقوف'})} 
                      style={{ width: '18px', height: '18px' }} />
                    الحساب نشط
                  </label>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'inherit' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3b82f6', color: 'white' }}>حفظ المستخدم</button>
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
