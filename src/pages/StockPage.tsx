import { useState, useEffect } from 'react'
import { db } from '../lib/storage'

export default function StockPage() {
  const [grains, setGrains] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])

  useEffect(() => {
    setGrains(db.grains().getAll())
    setWarehouses(db.warehouses().getAll())
    setMovements(db.movements().getAll())
  }, [])

  const getGrainName = (id: string) => grains.find((g) => g.id === id)?.name || id
  const getGrainUnit = (id: string) => grains.find((g) => g.id === id)?.unit || ''

  const computeStock = (warehouseId: string) => {
    const items: Record<string, number> = {}
    movements.forEach((m) => {
      if (m.type === 'entry' && m.warehouseId === warehouseId) items[m.grainId] = (items[m.grainId] || 0) + m.quantity
      if (m.type === 'exit' && m.warehouseId === warehouseId) items[m.grainId] = (items[m.grainId] || 0) - m.quantity
      if (m.type === 'transfer') {
        if (m.warehouseId === warehouseId) items[m.grainId] = (items[m.grainId] || 0) - m.quantity
        if (m.toWarehouseId === warehouseId) items[m.grainId] = (items[m.grainId] || 0) + m.quantity
      }
    })
    return Object.entries(items)
      .filter(([, qty]) => qty > 0)
      .map(([grainId, qty]) => ({ grainId, quantity: qty }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-sm text-gray-500">Saldo por armazém e grão</p>
      </div>
      <div className="space-y-6">
        {warehouses.map((w) => {
          const items = computeStock(w.id)
          const total = items.reduce((s, i) => s + i.quantity, 0)
          const pct = Math.min((total / w.capacity) * 100, 100)
          return (
            <div key={w.id} className="rounded-xl bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">{w.name}</h2>
                  <span className="text-sm text-gray-500">{w.location}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Total: {total.toLocaleString()} sc / {w.capacity.toLocaleString()} sc</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className={`h-2 rounded-full ${pct > 90 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grão</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map(({ grainId, quantity }) => (
                    <tr key={grainId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{getGrainName(grainId)}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium">{quantity.toLocaleString()} {getGrainUnit(grainId)}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">Sem estoque neste armazém</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}
