import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Settings, Bus, Printer, Download, X, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const Trips = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const tripSettings = useLiveQuery(() => db.tripSettings.toArray()) || [];
  const bookings = useLiveQuery(() => db.bookings.toArray()) || [];

  const [bookingData, setBookingData] = useState({
    routeId: '',
    passenger: '',
    phone: '',
    tickets: 1,
    delivery: false,
    paymentMethod: 'نقداً'
  });

  const [newRoute, setNewRoute] = useState({ route: '', price: '' });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const route = tripSettings.find(r => r.id.toString() === bookingData.routeId.toString()) || tripSettings[0];
    if (!route) return;

    const totalAmount = route.price * bookingData.tickets;
    
    await db.bookings.add({
      ticketNo: `#TKT-${Math.floor(Math.random() * 10000)}`,
      passenger: bookingData.passenger,
      phone: bookingData.phone,
      routeId: route.id,
      tickets: bookingData.tickets,
      delivery: bookingData.delivery,
      amount: totalAmount,
      paymentMethod: bookingData.paymentMethod,
      date: new Date().toISOString()
    });

    // Auto-sync with Wallet
    const lastTx = await db.transactions.orderBy('id').last();
    const currentBalance = lastTx ? lastTx.balance : 0;
    
    const isCash = bookingData.paymentMethod === 'نقداً';
    await db.transactions.add({
      receiptNo: `#BKG-${Math.floor(Math.random() * 10000)}`,
      type: `حجز تذكرة (${route.route})`,
      credit: isCash ? totalAmount : 0,
      debit: isCash ? 0 : totalAmount,
      balance: isCash ? currentBalance + totalAmount : currentBalance - totalAmount,
      point: 'مكتب الحجوزات',
      user: 'موظف الحجوزات',
      date: new Date().toISOString().split('T')[0],
      customer: bookingData.passenger,
      phone: bookingData.phone
    });

    setShowBookingModal(false);
    setBookingData({ routeId: '', passenger: '', phone: '', tickets: 1, delivery: false, paymentMethod: 'نقداً' });
  };

  const handleAddRoute = async () => {
    if (newRoute.route && newRoute.price) {
      await db.tripSettings.add({
        route: newRoute.route,
        price: parseFloat(newRoute.price)
      });
      setNewRoute({ route: '', price: '' });
    }
  };

  const handleDeleteRoute = async (id) => {
    await db.tripSettings.delete(id);
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('إلغاء هذا الحجز؟')) {
      await db.bookings.delete(id);
    }
  };

  const totalPassengers = bookings.reduce((sum, b) => sum + parseInt(b.tickets || 1), 0);

  return (
    <div>
      <div className="flex-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>حجز الرحلات (النقل)</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} onClick={() => setShowSettingsModal(true)}>
            <Settings size={18} /> إعدادات الخطوط
          </button>
          <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
            <Plus size={18} /> حجز تذكرة
          </button>
        </div>
      </div>

      <div className="grid-2 mb-6">
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 className="mb-4">خطوط السير النشطة</h3>
          <ul style={{ listStyle: 'none' }}>
            {tripSettings.map(route => (
              <li key={route.id} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>{route.route}</span>
                <strong>{route.price.toLocaleString()} ريال</strong>
              </li>
            ))}
            {tripSettings.length === 0 && <li className="text-secondary">لا توجد خطوط. الرجاء إضافتها من الإعدادات.</li>}
          </ul>
        </div>
        
        <div className="card" style={{ marginBottom: 0, backgroundColor: 'var(--primary-color)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Bus size={32} />
            <h3 style={{ margin: 0, color: 'white' }}>رحلات/حجوزات اليوم</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{bookings.length} حجوزات</p>
          <p style={{ opacity: 0.8 }}>إجمالي الركاب: {totalPassengers} راكب</p>
        </div>
      </div>

      <div className="card">
        <div className="flex-between mb-4">
          <h3>سجل الرحلات (Manifest)</h3>
          <button className="btn" style={{ fontSize: '0.875rem' }}><Download size={16}/> تصدير PDF للمرور</button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>رقم التذكرة</th>
                <th>اسم الراكب</th>
                <th>رقم الهاتف</th>
                <th>الوجهة</th>
                <th>عدد التذاكر</th>
                <th>توصيل</th>
                <th>المبلغ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => {
                const route = tripSettings.find(r => r.id === b.routeId);
                return (
                  <tr key={b.id}>
                    <td>{b.ticketNo}</td>
                    <td>{b.passenger}</td>
                    <td>{b.phone}</td>
                    <td>{route?.route || 'غير معروف'}</td>
                    <td>{b.tickets}</td>
                    <td>
                      <span className={b.delivery ? "text-success" : "text-danger"}>
                        {b.delivery ? 'نعم' : 'لا'}
                      </span>
                    </td>
                    <td>{b.amount?.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" title="طباعة تذكرة (QR)"><Printer size={18}/></button>
                        <button className="btn-icon" title="إلغاء الحجز" onClick={() => handleDeleteBooking(b.id)}><Trash2 size={18} className="text-danger" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showBookingModal && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--bg-secondary, #1e293b)',
              color: 'var(--text-primary, #ffffff)',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color, #334155)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color, #334155)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>حجز تذكرة جديدة</h2>
              <button type="button" onClick={() => setShowBookingModal(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group mb-4">
                  <label className="form-label">الوجهة (الخط)</label>
                  <select className="form-control" value={bookingData.routeId} onChange={e => setBookingData({...bookingData, routeId: e.target.value})} required>
                    <option value="">-- اختر الخط --</option>
                    {tripSettings.map(r => (
                      <option key={r.id} value={r.id}>{r.route} ({r.price.toLocaleString()})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">اسم الراكب كامل</label>
                  <input type="text" className="form-control" required value={bookingData.passenger} onChange={e => setBookingData({...bookingData, passenger: e.target.value})} />
                </div>
                <div className="grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" required value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">عدد التذاكر</label>
                    <input type="number" min="1" className="form-control" required value={bookingData.tickets} onChange={e => setBookingData({...bookingData, tickets: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="grid-2 mb-4" style={{ alignItems: 'center' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500' }}>
                      <input type="checkbox" checked={bookingData.delivery} onChange={e => setBookingData({...bookingData, delivery: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                      طلب توصيل للمنزل
                    </label>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">طريقة الدفع</label>
                    <select className="form-control" value={bookingData.paymentMethod} onChange={e => setBookingData({...bookingData, paymentMethod: e.target.value})}>
                      <option>نقداً</option>
                      <option>دين</option>
                    </select>
                  </div>
                </div>
                
                {bookingData.routeId && (
                  <>
                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color, #334155)' }} />
                    <div className="flex-between">
                      <strong style={{ fontSize: '1.25rem' }}>المبلغ الإجمالي:</strong>
                      <span className="text-success" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                        {((tripSettings.find(r => r.id.toString() === bookingData.routeId.toString())?.price || 0) * bookingData.tickets).toLocaleString()} ريال
                      </span>
                    </div>
                  </>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn" onClick={() => setShowBookingModal(false)} style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'inherit' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" disabled={!bookingData.routeId} style={{ backgroundColor: '#3b82f6', color: 'white' }}>تأكيد الحجز</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showSettingsModal && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--bg-secondary, #1e293b)',
              color: 'var(--text-primary, #ffffff)',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color, #334155)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color, #334155)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>إعدادات تسعير الخطوط</h2>
              <button type="button" onClick={() => setShowSettingsModal(false)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <div className="mb-6">
                {tripSettings.map(r => (
                  <div key={r.id} className="form-group flex-between mb-4">
                    <input type="text" className="form-control" readOnly value={r.route} style={{ width: '55%' }} />
                    <input type="number" className="form-control" readOnly value={r.price} style={{ width: '30%' }} />
                    <button type="button" onClick={() => handleDeleteRoute(r.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={18} className="text-danger"/></button>
                  </div>
                ))}
              </div>
              <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color, #334155)' }} />
              <h4>إضافة خط جديد</h4>
              <div className="form-group flex-between mt-4">
                <input type="text" className="form-control" placeholder="اسم الخط..." value={newRoute.route} onChange={e => setNewRoute({...newRoute, route: e.target.value})} style={{ width: '55%' }} />
                <input type="number" className="form-control" placeholder="السعر" value={newRoute.price} onChange={e => setNewRoute({...newRoute, price: e.target.value})} style={{ width: '30%' }} />
                <button type="button" className="btn btn-primary" onClick={handleAddRoute} style={{ backgroundColor: '#3b82f6', color: 'white' }}><Plus size={18} /></button>
              </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color, #334155)' }}>
              <button type="button" className="btn" onClick={() => setShowSettingsModal(false)} style={{ border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'inherit' }}>إغلاق</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Trips;
