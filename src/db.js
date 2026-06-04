import Dexie from 'dexie';

export const db = new Dexie('QabatiERPDB');

// Declare tables, IDs and indexes
db.version(1).stores({
  users: '++id, name, phone, role, status',
  transactions: '++id, receiptNo, type, credit, debit, balance, point, user, date, customer, phone',
  maintenance: '++id, engineer, pointNo, customer, phone, type, amount, paymentMethod, date',
  inspections: '++id, examiner, pointNo, type, customer, phone, plate, amount, paymentMethod, startDate, endDate, status',
  tripSettings: '++id, route, price',
  bookings: '++id, ticketNo, passenger, phone, routeId, tickets, delivery, amount, paymentMethod, date',

  // New tables for Platform Completion
  engineers: '++id, name, phone, specialty, status',
  vehicles: '++id, plate, type, model, owner, status',
  stations: '++id, name, location, contact, status',
  shipping: '++id, receiptNo, senderName, senderPhone, receiverName, receiverPhone, itemType, quantity, amount, immediateDelivery, status, date',
  billPayments: '++id, serviceType, accountNo, amount, commission, total, user, date',
  fuelLogs: '++id, busId, stationId, date, quantity, fuelType, paymentType, amount, user',
  auditLogs: '++id, user, action, module, recordId, timestamp, details'
});

export const initDbMockData = async () => {
  // Only add mock data if tables are empty
  const usersCount = await db.users.count();
  if (usersCount === 0) {
    await db.users.bulkAdd([
      { name: 'أحمد المدير', phone: 'admin@qabati.com', role: 'مدير النظام (Admin)', status: 'نشط' },
      { name: 'خالد المحاسب', phone: '771122334', role: 'كاشير/محاسب', status: 'نشط' },
      { name: 'وليد المهندس', phone: '779988776', role: 'مهندس/فاحص', status: 'نشط' }
    ]);
  }

  const engineersCount = await db.engineers.count();
  if (engineersCount === 0) {
    await db.engineers.bulkAdd([
      { name: 'وليد علي', phone: '770000001', specialty: 'ميكانيك', status: 'نشط' },
      { name: 'خالد محمد', phone: '770000002', specialty: 'كهرباء', status: 'نشط' },
      { name: 'عبدالله حسن', phone: '770000003', specialty: 'فحص فني', status: 'نشط' }
    ]);
  }

  const vehiclesCount = await db.vehicles.count();
  if (vehiclesCount === 0) {
    await db.vehicles.bulkAdd([
      { plate: '1/12345', type: 'باص همر', model: '2022', owner: 'شركة القباطي', status: 'نشط' },
      { plate: '2/54321', type: 'باص هايس', model: '2021', owner: 'أحمد علي', status: 'نشط' }
    ]);
  }

  const stationsCount = await db.stations.count();
  if (stationsCount === 0) {
    await db.stations.bulkAdd([
      { name: 'محطة القباطي - صنعاء', location: 'صنعاء - الجراف', contact: '01234567', status: 'نشط' },
      { name: 'محطة القباطي - تعز', location: 'تعز - الحوبان', contact: '04765432', status: 'نشط' }
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
      { receiptNo: '#REC-001', type: 'إيداع رصيد', credit: 1000000, debit: 0, balance: 1000000, point: 'نقد - الصندوق', user: 'أحمد المدير', date: new Date().toISOString(), customer: 'نظامي', phone: '000' }
    ]);
  }
};

initDbMockData();
