import React from 'react';
import { MessageSquare, Mail, Bell, Settings, Send, Check } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, type: 'WhatsApp', recipient: '777123456', message: 'تم تأكيد حجزك للرحلة رقم 102', status: 'تم الإرسال', time: 'منذ 5 دقائق' },
    { id: 2, type: 'SMS', recipient: '771000222', message: 'وصلت شحنتك رقم SHP-882 لمركز التوزيع', status: 'تم الإرسال', time: 'منذ ساعة' },
    { id: 3, type: 'WhatsApp', recipient: '770999000', message: 'فاتورة سداد يمن موبايل بقيمة 5000 ريال', status: 'في الانتظار', time: 'الآن' },
  ];

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">نظام الإشعارات</h1>
          <p className="text-secondary">مراقبة رسائل الواتساب وSMS الصادرة للعملاء</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary"><Settings size={20} /> إعدادات API</button>
          <button className="btn btn-primary"><MessageSquare size={20} /> إرسال رسالة يدوية</button>
        </div>
      </div>

      <div className="grid-2 mb-8">
        <div className="card" style={{ borderRight: '4px solid #25D366' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="flex items-center gap-2"><MessageSquare color="#25D366" /> حالة ربط WhatsApp</h3>
            <span className="badge badge-success">متصل</span>
          </div>
          <p className="text-secondary">تم الربط مع نظام Master Cashier API بنجاح.</p>
        </div>
        <div className="card" style={{ borderRight: '4px solid #3b82f6' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="flex items-center gap-2"><Mail color="#3b82f6" /> حالة رصيد SMS</h3>
            <span className="badge badge-warning">رصيد منخفض</span>
          </div>
          <p className="text-secondary">المتبقي: 150 رسالة. يرجى شحن الرصيد.</p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-6">آخر الرسائل الصادرة</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>النوع</th>
                <th>المستلم</th>
                <th>محتوى الرسالة</th>
                <th>الحالة</th>
                <th>الوقت</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td>
                    <span className={`badge ${n.type === 'WhatsApp' ? 'badge-success' : 'badge-primary'}`} style={{ backgroundColor: n.type === 'WhatsApp' ? '#25D366' : '#3b82f6', color: 'white' }}>
                      {n.type}
                    </span>
                  </td>
                  <td className="font-bold">{n.recipient}</td>
                  <td><div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.message}</div></td>
                  <td>
                    <span className={`badge ${n.status === 'تم الإرسال' ? 'badge-success' : 'badge-warning'}`}>
                      {n.status === 'تم الإرسال' ? <Check size={14} /> : ''} {n.status}
                    </span>
                  </td>
                  <td>{n.time}</td>
                  <td>
                    <button className="btn-icon"><Send size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
