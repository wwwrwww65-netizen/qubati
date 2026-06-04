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
    { path: '/', label: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> },
    { path: '/wallet', label: 'المحفظة المالية', icon: <Wallet size={20} /> },
    { path: '/maintenance', label: 'ورشة الصيانة', icon: <Wrench size={20} /> },
    { path: '/inspection', label: 'الفحص الدوري', icon: <ClipboardCheck size={20} /> },
    { path: '/trips', label: 'حجز الرحلات', icon: <Bus size={20} /> },
    { path: '/users', label: 'إدارة المستخدمين', icon: <Users size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          نظام القباطي ERP
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="main-content">
        <header className="header">
          <div className="flex-between" style={{ width: '100%' }}>
            <div className="flex-between" style={{ gap: '1rem' }}>
              <button className="btn-icon">
                <Menu size={24} />
              </button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>مرحباً بك، مدير النظام</h2>
            </div>
            
            <div className="flex-between" style={{ gap: '1rem' }}>
              <button className="btn-icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="user-profile" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
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
