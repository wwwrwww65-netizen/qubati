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
      { plate: '2/54321', type: 'باص هايس', model: '2021', owner: 'أحمد علي', status: 'نشط' },
      { plate: '3/67890', type: 'تويوتا كوستر', model: '2023', owner: 'محمد حسن', status: 'نشط' }
    ]);
  }

  const stationsCount = await db.stations.count();
  if (stationsCount === 0) {
    await db.stations.bulkAdd([
      { name: 'محطة القباطي - صنعاء', location: 'صنعاء - الجراف', contact: '01234567', status: 'نشط' },
      { name: 'محطة القباطي - تعز', location: 'تعز - الحوبان', contact: '04765432', status: 'نشط' },
      { name: 'محطة القباطي - عدن', location: 'عدن - المنصورة', contact: '02334455', status: 'نشط' }
    ]);
  }

  const tripSettingsCount = await db.tripSettings.count();
  if (tripSettingsCount === 0) {
    await db.tripSettings.bulkAdd([
      { route: 'صنعاء - الحديدة', price: 15000 },
      { route: 'صنعاء - تعز', price: 20000 },
      { route: 'صنعاء - عدن', price: 30000 },
      { route: 'عدن - تعز', price: 15000 }
    ]);
  }

  const transactionsCount = await db.transactions.count();
  if (transactionsCount === 0) {
    await db.transactions.bulkAdd([
      { receiptNo: '#REC-001', type: 'إيداع رصيد', credit: 1000000, debit: 0, balance: 1000000, point: 'نقد - الصندوق', user: 'أحمد المدير', date: new Date().toISOString(), customer: 'نظامي', phone: '000' },
      { receiptNo: '#REC-002', type: 'شحن محفظة جوالي', credit: 50000, debit: 0, balance: 1050000, point: 'جوالي', user: 'خالد المحاسب', date: new Date().toISOString(), customer: 'سالم محمد', phone: '777111222' }
    ]);
  }

  const maintenanceCount = await db.maintenance.count();
  if (maintenanceCount === 0) {
    await db.maintenance.bulkAdd([
      { engineer: 'وليد علي', pointNo: '102', customer: 'باص همر 1/12345', phone: '770112233', type: 'تغيير زيت وفلاتر', amount: 45000, paymentMethod: 'نقد', date: new Date().toISOString() },
      { engineer: 'خالد محمد', pointNo: '105', customer: 'باص هايس 2/54321', phone: '771223344', type: 'إصلاح فرامل', amount: 15000, paymentMethod: 'جوالي', date: new Date().toISOString() }
    ]);
  }

  const inspectionsCount = await db.inspections.count();
  if (inspectionsCount === 0) {
    await db.inspections.bulkAdd([
      { examiner: 'عبدالله حسن', pointNo: 'INS-01', type: 'فحص دوري', customer: 'أحمد علي', phone: '775556667', plate: '2/54321', amount: 5000, paymentMethod: 'نقد', startDate: new Date().toISOString(), endDate: new Date().toISOString(), status: 'ناجح' }
    ]);
  }

  const bookingsCount = await db.bookings.count();
  if (bookingsCount === 0) {
    await db.bookings.bulkAdd([
      { ticketNo: 'T-887', passenger: 'ياسر القبيطي', phone: '773344556', routeId: 2, tickets: 2, delivery: 'تعز - مفرق ماوية', amount: 40000, paymentMethod: 'ون كاش', date: new Date().toISOString() }
    ]);
  }

  const shippingCount = await db.shipping.count();
  if (shippingCount === 0) {
    await db.shipping.bulkAdd([
      { receiptNo: 'SHP-990', senderName: 'علي كمال', senderPhone: '770001112', receiverName: 'محمد فؤاد', receiverPhone: '771110002', itemType: 'كرتون قطع غيار', quantity: 3, amount: 12000, immediateDelivery: true, status: 'في الطريق', date: new Date().toISOString() }
    ]);
  }

  const billPaymentsCount = await db.billPayments.count();
  if (billPaymentsCount === 0) {
    await db.billPayments.bulkAdd([
      { serviceType: 'يمن موبايل - باقات', accountNo: '771234567', amount: 5000, commission: 250, total: 5250, user: 'خالد المحاسب', date: new Date().toISOString() }
    ]);
  }

  const fuelLogsCount = await db.fuelLogs.count();
  if (fuelLogsCount === 0) {
    await db.fuelLogs.bulkAdd([
      { busId: '1/12345', stationId: 'محطة القباطي - صنعاء', date: new Date().toISOString(), quantity: 100, fuelType: 'ديزل', paymentType: 'آجل', amount: 120000, user: 'أحمد المدير' }
    ]);
  }

  const auditLogsCount = await db.auditLogs.count();
  if (auditLogsCount === 0) {
    await db.auditLogs.bulkAdd([
      { user: 'أحمد المدير', action: 'دخول للنظام', module: 'الأمان', recordId: '-', timestamp: new Date().toISOString(), details: 'تسجيل دخول ناجح من IP 192.168.1.1' }
    ]);
  }
};

initDbMockData();
