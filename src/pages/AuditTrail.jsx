import React from 'react';
import { ShieldCheck, User, Clock, Info } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const AuditTrail = () => {
  const logs = useLiveQuery(() => db.auditLogs.toArray()) || [
    { id: 1, user: 'أحمد المدير', action: 'إضافة قيد مالي', module: 'المحفظة', timestamp: new Date().toISOString(), details: 'إضافة مبلغ 500,000 ريال' },
    { id: 2, user: 'أحمد المدير', action: 'تعديل بيانات مركبة', module: 'الأسطول', timestamp: new Date().toISOString(), details: 'تعديل لوحة باص همر' },
    { id: 3, user: 'خالد المحاسب', action: 'حذف حجز', module: 'الرحلات', timestamp: new Date().toISOString(), details: 'حذف تذكرة رقم 5543' }
  ];

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">السجل الرقابي (Audit Trail)</h1>
          <p className="text-secondary">تتبع حركات المستخدمين والعمليات الحساسة في النظام</p>
        </div>
        <div className="badge badge-danger" style={{ padding: '0.5rem 1rem' }}>خاص بالمدير فقط</div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>الوقت والتاريخ</th>
                <th>المستخدم</th>
                <th>العملية</th>
                <th>القسم</th>
                <th>التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-secondary" />
                      {new Date(log.timestamp).toLocaleString('ar-YE')}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 font-bold">
                      <User size={16} />
                      {log.user}
                    </div>
                  </td>
                  <td><span className="badge badge-warning">{log.action}</span></td>
                  <td>{log.module}</td>
                  <td><small>{log.details}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
