const DEMO_KEY = 'soyama_demo_seeded'

function seed() {
  const grains = [
    { id: 'g1', name: 'Soja', unit: 'sc', createdAt: new Date('2026-01-10').toISOString() },
    { id: 'g2', name: 'Milho', unit: 'sc', createdAt: new Date('2026-01-12').toISOString() },
    { id: 'g3', name: 'Trigo', unit: 'tonnes', createdAt: new Date('2026-01-15').toISOString() },
    { id: 'g4', name: 'Arroz', unit: 'sc', createdAt: new Date('2026-02-01').toISOString() },
    { id: 'g5', name: 'Sorgo', unit: 'sc', createdAt: new Date('2026-02-10').toISOString() },
  ]
  const warehouses = [
    { id: 'w1', name: 'Armazém Central', location: 'Rodovia BR-163, Km 50', capacity: 50000, createdAt: new Date('2025-06-01').toISOString() },
    { id: 'w2', name: 'Silo Norte', location: 'Zona Rural, Fazenda Esperança', capacity: 30000, createdAt: new Date('2025-08-15').toISOString() },
    { id: 'w3', name: 'Secador Sul', location: 'Parque Industrial, Lote 12', capacity: 20000, createdAt: new Date('2025-11-20').toISOString() },
    { id: 'w4', name: 'Pátio Leste', location: 'Av. Perimetral, 450', capacity: 15000, createdAt: new Date('2026-01-05').toISOString() },
  ]
  const suppliers = [
    { id: 's1', name: 'Agropecuária São João Ltda', document: '45.678.901/0001-23', contact: '(66) 99999-1111', createdAt: new Date('2025-09-10').toISOString() },
    { id: 's2', name: 'Cooperativa Agro Vale Verde', document: '12.345.678/0001-90', contact: '(65) 98888-2222', createdAt: new Date('2025-10-05').toISOString() },
    { id: 's3', name: 'Fazenda Bela Vista', document: '23.456.789/0001-45', contact: '(64) 97777-3333', createdAt: new Date('2026-01-20').toISOString() },
  ]
  const clients = [
    { id: 'c1', name: 'Indústria Alimentícia Brasil SA', document: '98.765.432/0001-10', contact: '(11) 3456-7890', createdAt: new Date('2025-07-10').toISOString() },
    { id: 'c2', name: 'Exportadora Grãos Sul Ltda', document: '87.654.321/0001-21', contact: '(41) 3344-5566', createdAt: new Date('2025-09-25').toISOString() },
    { id: 'c3', name: 'Comercial Cereais Centro-Oeste', document: '34.567.890/0001-67', contact: '(61) 2233-4455', createdAt: new Date('2026-02-15').toISOString() },
  ]
  const movements = [
    { id: 'm1', type: 'entry', grainId: 'g1', warehouseId: 'w1', quantity: 12000, supplierId: 's1', clientId: '', toWarehouseId: '', notes: 'Compra safra 2026', createdAt: new Date('2026-03-01T08:00').toISOString(), createdBy: 'admin' },
    { id: 'm2', type: 'entry', grainId: 'g2', warehouseId: 'w2', quantity: 8000, supplierId: 's2', clientId: '', toWarehouseId: '', notes: 'Compra safrinha milho', createdAt: new Date('2026-03-05T10:30').toISOString(), createdBy: 'admin' },
    { id: 'm3', type: 'entry', grainId: 'g1', warehouseId: 'w1', quantity: 5000, supplierId: 's3', clientId: '', toWarehouseId: '', notes: 'Compra adicional soja', createdAt: new Date('2026-03-10T14:15').toISOString(), createdBy: 'admin' },
    { id: 'm4', type: 'entry', grainId: 'g3', warehouseId: 'w3', quantity: 9500, supplierId: 's1', clientId: '', toWarehouseId: '', notes: 'Compra trigo importado', createdAt: new Date('2026-03-12T09:45').toISOString(), createdBy: 'admin' },
    { id: 'm5', type: 'entry', grainId: 'g4', warehouseId: 'w4', quantity: 6000, supplierId: 's2', clientId: '', toWarehouseId: '', notes: 'Compra arroz agroecológico', createdAt: new Date('2026-03-15T11:00').toISOString(), createdBy: 'admin' },
    { id: 'm6', type: 'exit', grainId: 'g1', warehouseId: 'w1', quantity: 8000, supplierId: '', clientId: 'c1', toWarehouseId: '', notes: 'Venda indústria', createdAt: new Date('2026-03-18T16:30').toISOString(), createdBy: 'admin' },
    { id: 'm7', type: 'exit', grainId: 'g2', warehouseId: 'w2', quantity: 3000, supplierId: '', clientId: 'c3', toWarehouseId: '', notes: 'Venda mercado interno', createdAt: new Date('2026-03-20T13:00').toISOString(), createdBy: 'admin' },
    { id: 'm8', type: 'transfer', grainId: 'g1', warehouseId: 'w1', quantity: 2000, supplierId: '', clientId: '', toWarehouseId: 'w4', notes: 'Transferência para secagem', createdAt: new Date('2026-03-22T07:30').toISOString(), createdBy: 'admin' },
    { id: 'm9', type: 'exit', grainId: 'g3', warehouseId: 'w3', quantity: 4500, supplierId: '', clientId: 'c2', toWarehouseId: '', notes: 'Exportação trigo', createdAt: new Date('2026-03-25T10:00').toISOString(), createdBy: 'admin' },
    { id: 'm10', type: 'entry', grainId: 'g5', warehouseId: 'w2', quantity: 3000, supplierId: 's3', clientId: '', toWarehouseId: '', notes: 'Compra sorgo forrageiro', createdAt: new Date('2026-03-28T08:45').toISOString(), createdBy: 'admin' },
  ]

  localStorage.setItem('soyama_grains', JSON.stringify(grains))
  localStorage.setItem('soyama_warehouses', JSON.stringify(warehouses))
  localStorage.setItem('soyama_suppliers', JSON.stringify(suppliers))
  localStorage.setItem('soyama_clients', JSON.stringify(clients))
  localStorage.setItem('soyama_movements', JSON.stringify(movements))
  localStorage.setItem(DEMO_KEY, '1')
}

export function ensureSeed() {
  if (!localStorage.getItem(DEMO_KEY)) {
    seed()
  }
}

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

export const db = {
  grains: () => ({ getAll: () => get<any>('soyama_grains'), set: (d: any[]) => set('soyama_grains', d) }),
  warehouses: () => ({ getAll: () => get<any>('soyama_warehouses'), set: (d: any[]) => set('soyama_warehouses', d) }),
  suppliers: () => ({ getAll: () => get<any>('soyama_suppliers'), set: (d: any[]) => set('soyama_suppliers', d) }),
  clients: () => ({ getAll: () => get<any>('soyama_clients'), set: (d: any[]) => set('soyama_clients', d) }),
  movements: () => ({ getAll: () => get<any>('soyama_movements'), set: (d: any[]) => set('soyama_movements', d) }),
}
