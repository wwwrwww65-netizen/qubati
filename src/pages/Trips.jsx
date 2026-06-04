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
      <div className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>حجز الرحلات (النقل)</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>إدارة خطوط السير وحجوزات الركاب</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowSettingsModal(true)} title="إعدادات الخطوط">
            <Settings size={24} /> <span>إعدادات الخطوط</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
            <Plus size={24} /> <span>حجز تذكرة جديدة</span>
          </button>
        </div>
      </div>

      <div className="grid-2 mb-8">
        <div className="card" style={{ margin: 0 }}>
          <h3 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: '700' }}>خطوط السير النشطة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tripSettings.map(route => (
              <div key={route.id} className="flex-between" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                <span style={{ fontWeight: '600' }}>{route.route}</span>
                <strong style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}>{route.price.toLocaleString()} ريال</strong>
              </div>
            ))}
            {tripSettings.length === 0 && <p className="text-secondary">لا توجد خطوط. الرجاء إضافتها من الإعدادات.</p>}
          </div>
        </div>
        
        <div className="card" style={{ margin: 0, backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <Bus size={48} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>حجوزات اليوم</h3>
              <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>إجمالي الركاب: {totalPassengers} راكب</p>
            </div>
          </div>
          <p style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1 }}>{bookings.length}</p>
          <p style={{ opacity: 0.8, marginTop: '0.5rem', fontSize: '1.1rem' }}>تذكرة مؤكدة</p>
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
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>حجز تذكرة جديدة</h2>
              <button className="btn-icon" onClick={() => setShowBookingModal(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label className="form-label">الوجهة (الخط)</label>
                  <select className="form-control" value={bookingData.routeId} onChange={e => setBookingData({...bookingData, routeId: e.target.value})} required>
                    <option value="">-- اختر الخط --</option>
                    {tripSettings.map(r => (
                      <option key={r.id} value={r.id}>{r.route} ({r.price.toLocaleString()})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">اسم الراكب كامل</label>
                  <input type="text" className="form-control" required value={bookingData.passenger} onChange={e => setBookingData({...bookingData, passenger: e.target.value})} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" required value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">عدد التذاكر</label>
                    <input type="number" min="1" className="form-control" required value={bookingData.tickets} onChange={e => setBookingData({...bookingData, tickets: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="grid-2" style={{ alignItems: 'center' }}>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input type="checkbox" checked={bookingData.delivery} onChange={e => setBookingData({...bookingData, delivery: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                      طلب توصيل للمنزل
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">طريقة الدفع</label>
                    <select className="form-control" value={bookingData.paymentMethod} onChange={e => setBookingData({...bookingData, paymentMethod: e.target.value})}>
                      <option>نقداً</option>
                      <option>دين</option>
                    </select>
                  </div>
                </div>
                
                {bookingData.routeId && (
                  <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'var(--success-soft)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.25rem' }}>المبلغ الإجمالي:</strong>
                    <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--success-color)' }}>
                      {((tripSettings.find(r => r.id.toString() === bookingData.routeId.toString())?.price || 0) * bookingData.tickets).toLocaleString()} ريال
                    </span>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowBookingModal(false)} style={{ border: '1px solid var(--border-color)' }}>إلغاء</button>
                  <button type="submit" className="btn btn-primary" disabled={!bookingData.routeId}>تأكيد الحجز</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showSettingsModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>إعدادات تسعير الخطوط</h2>
              <button className="btn-icon" onClick={() => setShowSettingsModal(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {tripSettings.map(r => (
                  <div key={r.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <input type="text" className="form-control" readOnly value={r.route} style={{ flex: 2 }} />
                    <input type="number" className="form-control" readOnly value={r.price} style={{ flex: 1 }} />
                    <button className="btn-icon" onClick={() => handleDeleteRoute(r.id)}><Trash2 size={20} className="text-danger"/></button>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1.5rem' }}>إضافة خط جديد</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" className="form-control" placeholder="اسم الخط..." value={newRoute.route} onChange={e => setNewRoute({...newRoute, route: e.target.value})} style={{ flex: 2 }} />
                  <input type="number" className="form-control" placeholder="السعر" value={newRoute.price} onChange={e => setNewRoute({...newRoute, price: e.target.value})} style={{ flex: 1 }} />
                  <button className="btn btn-primary" onClick={handleAddRoute}><Plus size={24} /></button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={() => setShowSettingsModal(false)} style={{ border: '1px solid var(--border-color)' }}>إغلاق</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Trips;
