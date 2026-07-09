export interface Grain {
  id: string
  name: string
  unit: 'kg' | 'sc' | 'tonnes' | 'bushels'
  createdAt: Date
}

export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  createdAt: Date
}

export interface Supplier {
  id: string
  name: string
  document: string
  contact: string
  createdAt: Date
}

export interface Client {
  id: string
  name: string
  document: string
  contact: string
  createdAt: Date
}

export interface Movement {
  id: string
  type: 'entry' | 'exit' | 'transfer'
  grainId: string
  warehouseId: string
  toWarehouseId?: string
  quantity: number
  supplierId?: string
  clientId?: string
  notes: string
  createdAt: Date
  createdBy: string
}

export interface Stock {
  id: string
  grainId: string
  warehouseId: string
  quantity: number
  lastUpdated: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'operator'
}
