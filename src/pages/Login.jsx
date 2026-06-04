import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--sidebar-active-bg) 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '3.5rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--primary-soft)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--primary-color)',
            fontSize: '2rem',
            fontWeight: '900'
          }}>
            ق
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>نظام القباطي الشامل</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>تسجيل الدخول لإدارة أعمالك</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">رقم الهاتف أو البريد الإلكتروني</label>
            <input type="text" className="form-control" placeholder="أدخل بيانات الدخول..." required style={{ padding: '1.25rem' }} />
          </div>
          
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input type="password" className="form-control" placeholder="••••••••" required style={{ padding: '1.25rem' }} />
          </div>
          
          <div className="flex-between mb-8">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>تذكرني</span>
            </label>
            <a href="#" style={{ fontSize: '1rem', color: 'var(--primary-color)', fontWeight: '600' }}>نسيت كلمة المرور؟</a>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
            دخول للنظام
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
