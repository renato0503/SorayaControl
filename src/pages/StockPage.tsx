import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Stock, Grain, Warehouse } from '../types'

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubStocks = onSnapshot(collection(db, 'stock'), (snap) => {
      setStocks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Stock)))
      setLoading(false)
    })
    const unsubGrains = onSnapshot(collection(db, 'grains'), (snap) => {
      setGrains(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Grain)))
    })
    const unsubWarehouses = onSnapshot(collection(db, 'warehouses'), (snap) => {
      setWarehouses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Warehouse)))
    })
    return () => {
      unsubStocks()
      unsubGrains()
      unsubWarehouses()
    }
  }, [])

  const getGrainName = (id: string) => grains.find((g) => g.id === id)?.name || id
  const getGrainUnit = (id: string) => grains.find((g) => g.id === id)?.unit || ''
  const getWarehouseName = (id: string) => warehouses.find((w) => w.id === id)?.name || id

  const stockByWarehouse = warehouses.map((w) => ({
    warehouse: w,
    items: stocks.filter((s) => s.warehouseId === w.id),
    total: stocks.filter((s) => s.warehouseId === w.id).reduce((acc, s) => acc + s.quantity, 0),
  }))

  const totalStock = stocks.reduce((acc, s) => acc + s.quantity, 0)

  if (loading) {
    return <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
    </div>
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-sm text-gray-500">Controle de saldo por armazém e grão</p>
      </div>

      <div className="rounded-xl bg-green-50 p-4">
        <p className="text-sm text-green-800">Total em estoque: <span className="font-bold text-lg">{totalStock.toLocaleString()}</span> sacas</p>
      </div>

      <div className="space-y-6">
        {stockByWarehouse.map(({ warehouse, items, total }) => (
          <div key={warehouse.id} className="rounded-xl bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{warehouse.name}</h2>
                <span className="text-sm text-gray-500">{warehouse.location}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Total: {total.toLocaleString()} sc / {warehouse.capacity.toLocaleString()} sc</p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${(total / warehouse.capacity) > 0.9 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((total / warehouse.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grão</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Última Atualização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{getGrainName(item.grainId)}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                      {item.quantity.toLocaleString()} {getGrainUnit(item.grainId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500">
                      {item.lastUpdated?.toDate().toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Sem estoque neste armazém</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {stocks.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
          Nenhum registro de estoque
        </div>
      )}
    </div>
  )
}
