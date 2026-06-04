import Dexie from 'dexie';

export const db = new Dexie('QabatiERPDB');

// Declare tables, IDs and indexes
db.version(1).stores({
  users: '++id, name, phone, role, status',
  transactions: '++id, receiptNo, type, credit, debit, balance, point, user, date, customer, phone',
  maintenance: '++id, engineer, pointNo, customer, phone, type, amount, paymentMethod, date',
  inspections: '++id, examiner, pointNo, type, customer, phone, plate, amount, paymentMethod, startDate, endDate, status',
  tripSettings: '++id, route, price',
  bookings: '++id, ticketNo, passenger, phone, routeId, tickets, delivery, amount, paymentMethod, date'
});

export const initDbMockData = async () => {
  // Only add mock data if tables are empty
  const usersCount = await db.users.count();
  if (usersCount === 0) {
    await db.users.bulkAdd([
      { name: 'أحمد المدير', phone: 'admin@qabati.com', role: 'مدير النظام (Admin)', status: 'نشط' },
      { name: 'خالد المحاسب', phone: '771122334', role: 'كاشير/محاسب', status: 'نشط' },
      { name: 'وليد المهندس', phone: '779988776', role: 'مهندس/فاحص', status: 'موقوف' }
    ]);
  }

  const tripSettingsCount = await db.tripSettings.count();
  if (tripSettingsCount === 0) {
    await db.tripSettings.bulkAdd([
      { route: 'صنعاء - الحديدة', price: 15000 },
      { route: 'صنعاء - تعز', price: 20000 },
      { route: 'صنعاء - عدن', price: 30000 }
    ]);
  }

  const transactionsCount = await db.transactions.count();
  if (transactionsCount === 0) {
    await db.transactions.bulkAdd([
      { receiptNo: '#REC-001', type: 'تسديد فاتورة', credit: 0, debit: 10000, balance: 490000, point: 'جوالي', user: 'أحمد', date: new Date().toISOString(), customer: 'محمد', phone: '777' },
      { receiptNo: '#REC-002', type: 'شحن محفظة', credit: 50000, debit: 0, balance: 540000, point: 'ون كاش', user: 'أحمد', date: new Date().toISOString(), customer: 'سالم', phone: '777' }
    ]);
  }
};

initDbMockData();
