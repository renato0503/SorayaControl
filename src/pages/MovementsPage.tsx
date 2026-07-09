import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Movement, Grain, Warehouse, Supplier, Client, Stock } from '../types'
import Modal from '../components/Modal'

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    type: 'entry' as Movement['type'],
    grainId: '',
    warehouseId: '',
    toWarehouseId: '',
    quantity: '',
    supplierId: '',
    clientId: '',
    notes: '',
  })

  useEffect(() => {
    const unsubMovements = onSnapshot(query(collection(db, 'movements'), orderBy('createdAt', 'desc')), (snap) => {
      setMovements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Movement)))
      setLoading(false)
    })
    const unsubGrains = onSnapshot(collection(db, 'grains'), (snap) => {
      setGrains(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Grain)))
    })
    const unsubWarehouses = onSnapshot(collection(db, 'warehouses'), (snap) => {
      setWarehouses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Warehouse)))
    })
    const unsubSuppliers = onSnapshot(collection(db, 'suppliers'), (snap) => {
      setSuppliers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Supplier)))
    })
    const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client)))
    })
    return () => {
      unsubMovements()
      unsubGrains()
      unsubWarehouses()
      unsubSuppliers()
      unsubClients()
    }
  }, [])

  const updateStock = async (grainId: string, warehouseId: string, quantity: number, type: string, toWarehouseId?: string) => {
    const q = query(collection(db, 'stock'))
    const snapshot = await getDocs(q)
    const existingStock = snapshot.docs.find(
      (d) => d.data().grainId === grainId && d.data().warehouseId === warehouseId
    )

    if (type === 'entry') {
      if (existingStock) {
        await updateDoc(doc(db, 'stock', existingStock.id), {
          quantity: existingStock.data().quantity + quantity,
          lastUpdated: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, 'stock'), {
          grainId,
          warehouseId,
          quantity,
          lastUpdated: serverTimestamp(),
        })
      }
    } else if (type === 'exit') {
      if (existingStock) {
        await updateDoc(doc(db, 'stock', existingStock.id), {
          quantity: Math.max(0, existingStock.data().quantity - quantity),
          lastUpdated: serverTimestamp(),
        })
      }
    } else if (type === 'transfer' && toWarehouseId) {
      if (existingStock) {
        await updateDoc(doc(db, 'stock', existingStock.id), {
          quantity: existingStock.data().quantity - quantity,
          lastUpdated: serverTimestamp(),
        })
      }
      const destStock = snapshot.docs.find(
        (d) => d.data().grainId === grainId && d.data().warehouseId === toWarehouseId
      )
      if (destStock) {
        await updateDoc(doc(db, 'stock', destStock.id), {
          quantity: destStock.data().quantity + quantity,
          lastUpdated: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, 'stock'), {
          grainId,
          warehouseId: toWarehouseId,
          quantity,
          lastUpdated: serverTimestamp(),
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const quantity = Number(form.quantity)
    await addDoc(collection(db, 'movements'), {
      type: form.type,
      grainId: form.grainId,
      warehouseId: form.warehouseId,
      toWarehouseId: form.type === 'transfer' ? form.toWarehouseId : null,
      quantity,
      supplierId: form.type === 'entry' ? form.supplierId : null,
      clientId: form.type === 'exit' ? form.clientId : null,
      notes: form.notes,
      createdAt: serverTimestamp(),
      createdBy: 'current-user',
    })
    await updateStock(form.grainId, form.warehouseId, quantity, form.type, form.toWarehouseId)
    setIsModalOpen(false)
    setForm({ type: 'entry', grainId: '', warehouseId: '', toWarehouseId: '', quantity: '', supplierId: '', clientId: '', notes: '' })
  }

  const getGrainName = (id: string) => grains.find((g) => g.id === id)?.name || id
  const getWarehouseName = (id: string) => warehouses.find((w) => w.id === id)?.name || id

  if (loading) {
    return <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
          <p className="text-sm text-gray-500">Registro de entradas, saídas e transferências</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + Nova Movimentação
        </button>
      </div>

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grão</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem/Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{m.createdAt?.toDate().toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-medium ${
                    m.type === 'entry' ? 'bg-green-100 text-green-800' :
                    m.type === 'exit' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Saída' : 'Transferência'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{getGrainName(m.grainId)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.quantity.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.type === 'transfer' ? `${getWarehouseName(m.warehouseId)} → ${getWarehouseName(m.toWarehouseId!)}` : getWarehouseName(m.warehouseId)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {movements.length === 0 && (
          <div className="p-8 text-center text-gray-500">Nenhuma movimentação registrada</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Movimentação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Movement['type'] })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="entry">Entrada</option>
              <option value="exit">Saída</option>
              <option value="transfer">Transferência</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grão</label>
            <select
              value={form.grainId}
              onChange={(e) => setForm({ ...form, grainId: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            >
              <option value="">Selecione...</option>
              {grains.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Armazém</label>
            <select
              value={form.warehouseId}
              onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            >
              <option value="">Selecione...</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          {form.type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Armazém Destino</label>
              <select
                value={form.toWarehouseId}
                onChange={(e) => setForm({ ...form, toWarehouseId: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                required
              >
                <option value="">Selecione...</option>
                {warehouses.filter((w) => w.id !== form.warehouseId).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          )}
          {form.type === 'entry' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
              <select
                value={form.supplierId}
                onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {form.type === 'exit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Registrar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
