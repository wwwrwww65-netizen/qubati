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
  Menu,
  Truck,
  UserCog,
  MapPin,
  Package,
  CreditCard,
  Fuel,
  FileBarChart,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

const Layout = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDark]);

  const navGroups = [
    {
      label: 'الرئيسية',
      items: [
        { path: '/', label: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> },
        { path: '/wallet', label: 'المحفظة المالية', icon: <Wallet size={20} /> },
      ]
    },
    {
      label: 'العمليات الأساسية',
      items: [
        { path: '/trips', label: 'حجز الرحلات', icon: <Bus size={20} /> },
        { path: '/shipping', label: 'الشحن والطرود', icon: <Package size={20} /> },
        { path: '/bill-payments', label: 'سداد الفواتير', icon: <CreditCard size={20} /> },
      ]
    },
    {
      label: 'الفحص والصيانة',
      items: [
        { path: '/maintenance', label: 'ورشة الصيانة', icon: <Wrench size={20} /> },
        { path: '/inspection', label: 'الفحص الدوري', icon: <ClipboardCheck size={20} /> },
        { path: '/fuel', label: 'إدارة الوقود', icon: <Fuel size={20} /> },
      ]
    },
    {
      label: 'إدارة البيانات',
      items: [
        { path: '/vehicles', label: 'إدارة الأسطول', icon: <Truck size={20} /> },
        { path: '/engineers', label: 'إدارة المهندسين', icon: <UserCog size={20} /> },
        { path: '/stations', label: 'إدارة المحطات', icon: <MapPin size={20} /> },
      ]
    },
    {
      label: 'الرقابة والتقارير',
      items: [
        { path: '/reports', label: 'مركز التقارير', icon: <FileBarChart size={20} /> },
        { path: '/audit', label: 'السجل الرقابي', icon: <ShieldCheck size={20} /> },
        { path: '/notifications', label: 'الإشعارات', icon: <MessageSquare size={20} /> },
        { path: '/users', label: 'إدارة المستخدمين', icon: <Users size={20} /> },
      ]
    }
  ];

  return (
    <div className="app-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span>القباطي</span>
          <span style={{ color: 'var(--text-primary)', opacity: 0.5, marginRight: '8px', fontSize: '1rem' }}>ERP</span>
        </div>
        <nav className="sidebar-nav">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="nav-item logout-btn" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn-icon mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu size={24} />
              </button>
              <h2 className="font-black" style={{ fontSize: '1.25rem', margin: 0 }}>مرحباً بك، مدير النظام 👋</h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn-icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="user-profile" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
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
