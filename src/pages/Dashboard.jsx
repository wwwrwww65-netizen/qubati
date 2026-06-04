import React from 'react';
import { Wallet, Users, Wrench, Bus, Download } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Dashboard = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  const maintenanceRecords = useLiveQuery(() => db.maintenance.toArray()) || [];
  const bookings = useLiveQuery(() => db.bookings.toArray()) || [];
  const users = useLiveQuery(() => db.users.toArray()) || [];

  const totalBalance = transactions.length ? (transactions[transactions.length - 1]?.balance || 0) : 0;
  const recentTransactions = [...transactions].reverse().slice(0, 5); // top 5 recent

  return (
    <div className="fade-in">
      <div className="ticker-wrapper">
        <div className="ticker-text">
          الشوافي لخدمات النقل والسفريات والتسويق والسياحي اينما تكون نحن معك .. صنعاء - القبيطة - الراهدة - تعز - الاحكوم - حيفان الاعبوس -الاعروق الاغبرة - عدن - الحديدة
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">لوحة القيادة</h1>
          <p className="text-secondary">نظرة عامة على أداء النظام والعمليات الحالية</p>
        </div>
        <button className="btn btn-primary">
          <Download size={20} /> تصدير تقرير PDF
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Wallet size={32} /></div>
          <div className="stat-content">
            <h3>رصيد المحفظة الإجمالي</h3>
            <p className="font-black">{totalBalance.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderRight: '4px solid var(--success-color)' }}>
          <div className="stat-icon" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>
            <Users size={32} />
          </div>
          <div className="stat-content">
            <h3>المستخدمين</h3>
            <p className="font-black">{users.length} مستخدم</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderRight: '4px solid var(--warning-color)' }}>
          <div className="stat-icon" style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)' }}>
            <Wrench size={32} />
          </div>
          <div className="stat-content">
            <h3>عمليات الصيانة</h3>
            <p className="font-black">{maintenanceRecords.length} عملية</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderRight: '4px solid var(--danger-color)' }}>
          <div className="stat-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger-color)' }}>
            <Bus size={32} />
          </div>
          <div className="stat-content">
            <h3>إجمالي الحجوزات</h3>
            <p className="font-black">{bookings.length} حجز</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">أحدث العمليات المالية</h3>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>عرض الكل</button>
          </div>
          <div className="table-wrapper">
            <table className="table" style={{ minWidth: '100%' }}>
              <thead>
                <tr>
                  <th>رقم السند</th>
                  <th>النوع</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.receiptNo}</td>
                    <td>{tx.type}</td>
                    <td className={tx.credit > 0 ? "text-success font-bold" : "text-danger font-bold"}>
                      {tx.credit > 0 ? `+${tx.credit.toLocaleString()}` : `-${tx.debit.toLocaleString()}`}
                    </td>
                    <td><span className="badge badge-success">مكتمل</span></td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && <tr><td colSpan="4" className="text-center text-secondary">لا توجد عمليات بعد.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-6">التنبيهات السريعة</h3>
          <div className="flex flex-col gap-4">
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--warning-soft)', borderRight: '4px solid var(--warning-color)' }}>
              <p style={{ fontWeight: '800', color: 'var(--warning-color)', marginBottom: '0.25rem' }}>تنبيه فحص</p>
              <p>3 مركبات اقترب موعد فحصها الدوري.</p>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--success-soft)', borderRight: '4px solid var(--success-color)' }}>
              <p style={{ fontWeight: '800', color: 'var(--success-color)', marginBottom: '0.25rem' }}>تنبيه نظام</p>
              <p>تم أخذ نسخة احتياطية محلية بنجاح.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
