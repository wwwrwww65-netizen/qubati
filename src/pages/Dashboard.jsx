import React from 'react';
import { Wallet, Users, Wrench, Bus } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Dashboard = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  const maintenanceRecords = useLiveQuery(() => db.maintenance.toArray()) || [];
  const bookings = useLiveQuery(() => db.bookings.toArray()) || [];
  const users = useLiveQuery(() => db.users.toArray()) || [];

  const totalBalance = transactions.length ? transactions[transactions.length - 1].balance : 0;
  const recentTransactions = [...transactions].reverse().slice(0, 5); // top 5 recent

  return (
    <div>
      <div className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>لوحة القيادة</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>نظرة عامة على أداء النظام والعمليات الحالية</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          تصدير تقرير PDF
        </button>
      </div>

      <div className="grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon"><Wallet size={32} /></div>
          <div className="stat-content">
            <h3>رصيد المحفظة الإجمالي</h3>
            <p>{totalBalance.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--primary-color': 'var(--success-color)', '--primary-soft': 'var(--success-soft)' }}>
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <h3>المستخدمين</h3>
            <p>{users.length} مستخدم</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--primary-color': 'var(--warning-color)', '--primary-soft': 'var(--warning-soft)' }}>
          <div className="stat-icon">
            <Wrench size={32} />
          </div>
          <div className="stat-content">
            <h3>عمليات الصيانة</h3>
            <p>{maintenanceRecords.length} عملية</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--primary-color': 'var(--danger-color)', '--primary-soft': 'var(--danger-soft)' }}>
          <div className="stat-icon">
            <Bus size={32} />
          </div>
          <div className="stat-content">
            <h3>إجمالي الحجوزات</h3>
            <p>{bookings.length} حجز</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="flex-between mb-6">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>أحدث العمليات المالية</h3>
            <button className="btn" style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>عرض الكل</button>
          </div>
          <div className="table-wrapper">
            <table className="table">
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
                    <td className={tx.credit > 0 ? "text-success" : "text-danger"}>
                      {tx.credit > 0 ? `+${tx.credit.toLocaleString()}` : `-${tx.debit.toLocaleString()}`}
                    </td>
                    <td><span className="text-success">مكتمل</span></td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && <tr><td colSpan="4" className="text-center text-secondary">لا توجد عمليات بعد.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: '700' }}>التنبيهات السريعة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--warning-soft)', borderRight: '4px solid var(--warning-color)' }}>
              <p style={{ fontWeight: '700', color: 'var(--warning-color)', marginBottom: '0.25rem' }}>تنبيه فحص</p>
              <p style={{ fontSize: '1rem' }}>3 مركبات اقترب موعد فحصها الدوري.</p>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--success-soft)', borderRight: '4px solid var(--success-color)' }}>
              <p style={{ fontWeight: '700', color: 'var(--success-color)', marginBottom: '0.25rem' }}>تنبيه نظام</p>
              <p style={{ fontSize: '1rem' }}>تم أخذ نسخة احتياطية محلية بنجاح.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
