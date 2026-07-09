import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Stock, Grain, Warehouse, Movement } from '../types'

export default function DashboardPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubStocks = onSnapshot(collection(db, 'stock'), (snap) => {
      setStocks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Stock)))
    })

    const unsubGrains = onSnapshot(collection(db, 'grains'), (snap) => {
      setGrains(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Grain)))
    })

    const unsubWarehouses = onSnapshot(collection(db, 'warehouses'), (snap) => {
      setWarehouses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Warehouse)))
    })

    const q = query(collection(db, 'movements'), orderBy('createdAt', 'desc'), limit(10))
    const unsubMovements = onSnapshot(q, (snap) => {
      setMovements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Movement)))
      setLoading(false)
    })

    return () => {
      unsubStocks()
      unsubGrains()
      unsubWarehouses()
      unsubMovements()
    }
  }, [])

  const totalStock = stocks.reduce((acc, s) => acc + s.quantity, 0)

  const stockByGrain = grains.map((g) => ({
    grain: g,
    total: stocks.filter((s) => s.grainId === g.id).reduce((acc, s) => acc + s.quantity, 0),
  }))

  const getGrainName = (id: string) => grains.find((g) => g.id === id)?.name || id
  const getWarehouseName = (id: string) => warehouses.find((w) => w.id === id)?.name || id

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral do estoque</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total em Estoque</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tipos de Grãos</p>
              <p className="text-2xl font-bold text-gray-900">{grains.length}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Armazéns</p>
              <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Movimentações</p>
              <p className="text-2xl font-bold text-gray-900">{movements.length}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Estoque por Grão</h2>
          <div className="space-y-3">
            {stockByGrain.map(({ grain, total }) => (
              <div key={grain.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{grain.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${Math.min((total / totalStock) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {total.toLocaleString()} {grain.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Últimas Movimentações</h2>
          <div className="space-y-3">
            {movements.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Saída' : 'Transferência'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getGrainName(m.grainId)} • {getWarehouseName(m.warehouseId)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${m.type === 'entry' ? 'text-green-600' : 'text-red-600'}`}>
                    {m.type === 'entry' ? '+' : '-'}{m.quantity.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {m.createdAt.toDate().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
