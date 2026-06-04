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
      <div className="flex-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>لوحة القيادة</h1>
        <button className="btn btn-primary">تصدير تقرير PDF</button>
      </div>

      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon"><Wallet size={24} /></div>
          <div className="stat-content">
            <h3>رصيد المحفظة الإجمالي</h3>
            <p>{totalBalance.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>المستخدمين</h3>
            <p>{users.length} مستخدم</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
            <Wrench size={24} />
          </div>
          <div className="stat-content">
            <h3>عمليات الصيانة</h3>
            <p>{maintenanceRecords.length} عملية</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
            <Bus size={24} />
          </div>
          <div className="stat-content">
            <h3>إجمالي الحجوزات</h3>
            <p>{bookings.length} حجز</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="mb-4">أحدث العمليات المالية</h3>
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
          <h3 className="mb-4">التنبيهات السريعة</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <strong className="text-warning">تنبيه فحص:</strong> 3 مركبات اقترب موعد فحصها الدوري.
            </li>
            <li style={{ padding: '1rem' }}>
              <strong className="text-success">تنبيه نظام:</strong> تم أخذ نسخة احتياطية محلية بنجاح.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
