import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Wrench, 
  ClipboardCheck, 
  Bus, 
  Users,
  LogOut,
  Moon,
  Sun,
  Menu
} from 'lucide-react';

const Layout = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDark]);

  const navItems = [
    { path: '/', label: 'لوحة القيادة', icon: <LayoutDashboard size={24} /> },
    { path: '/wallet', label: 'المحفظة المالية', icon: <Wallet size={24} /> },
    { path: '/maintenance', label: 'ورشة الصيانة', icon: <Wrench size={24} /> },
    { path: '/inspection', label: 'الفحص الدوري', icon: <ClipboardCheck size={24} /> },
    { path: '/trips', label: 'حجز الرحلات', icon: <Bus size={24} /> },
    { path: '/users', label: 'إدارة المستخدمين', icon: <Users size={24} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span>القباطي</span>
          <span style={{ color: 'var(--text-primary)', opacity: 0.5, marginRight: '5px' }}>ERP</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="nav-item logout-btn" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}>
            <LogOut size={24} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="main-content">
        <header className="header">
          <div className="flex-between" style={{ width: '100%' }}>
            <div className="flex-between" style={{ gap: '1.5rem' }}>
              <button className="btn-icon">
                <Menu size={28} />
              </button>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>مرحباً بك، مدير النظام 👋</h2>
            </div>
            
            <div className="flex-between" style={{ gap: '1.5rem' }}>
              <button className="btn-icon" onClick={() => setIsDark(!isDark)} style={{ width: '50px', height: '50px' }}>
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <div className="user-profile" style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', boxShadow: 'var(--shadow-md)' }}>
                م
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
