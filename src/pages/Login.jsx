import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>نظام القباطي الشامل</h1>
          <p style={{ color: 'var(--text-secondary)' }}>تسجيل الدخول للنظام</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">رقم الهاتف أو البريد الإلكتروني</label>
            <input type="text" className="form-control" placeholder="أدخل رقم الهاتف..." required />
          </div>
          
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input type="password" className="form-control" placeholder="••••••••" required />
          </div>
          
          <div className="flex-between mb-6">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span style={{ fontSize: '0.875rem' }}>تذكرني</span>
            </label>
            <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary-color)' }}>نسيت كلمة المرور؟</a>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
