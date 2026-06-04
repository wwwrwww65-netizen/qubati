import React from 'react';
import { FileText, Download, TrendingUp, Users, Calendar } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Reports = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray());
  const bookings = useLiveQuery(() => db.bookings.toArray());

  const totalIncome = transactions?.reduce((acc, curr) => acc + (curr.credit || 0), 0) || 0;
  const totalExpense = transactions?.reduce((acc, curr) => acc + (curr.debit || 0), 0) || 0;

  const handleExportPDF = () => {
    alert('سيتم إنشاء ملف PDF للتقرير المالي...');
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">مركز التقارير</h1>
          <p className="text-secondary">كشوفات الحساب، الإغلاق اليومي، والإحصائيات</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportPDF}>
          <Download size={24} /> تصدير PDF الشامل
        </button>
      </div>

      <div className="grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي الإيرادات</h3>
            <p className="text-success">{totalIncome.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger-color)' }}><TrendingUp size={32} /></div>
          <div className="stat-content">
            <h3>إجمالي المصروفات</h3>
            <p className="text-danger">{totalExpense.toLocaleString()} ريال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Users size={32} /></div>
          <div className="stat-content">
            <h3>حجوزات اليوم</h3>
            <p>{bookings?.length || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Calendar size={32} /></div>
          <div className="stat-content">
            <h3>رصيد الصندوق الحالي</h3>
            <p>{(totalIncome - totalExpense).toLocaleString()} ريال</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="mb-4">تقرير الإغلاق اليومي (EOD)</h3>
          <div className="flex justify-between mb-2">
            <span>إجمالي النقد:</span>
            <span className="font-bold">500,000 ريال</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>إجمالي الآجل:</span>
            <span className="font-bold">120,000 ريال</span>
          </div>
          <hr className="mb-4" style={{ borderColor: 'var(--border-color)' }} />
          <button className="btn btn-primary w-full">إجراء إغلاق الصندوق</button>
        </div>

        <div className="card">
          <h3 className="mb-4">كشوفات حساب العملاء</h3>
          <div className="form-group">
            <label className="form-label">اختر العميل</label>
            <input type="text" className="form-control" placeholder="بحث عن عميل..." />
          </div>
          <button className="btn btn-secondary w-full">عرض كشف الحساب</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
