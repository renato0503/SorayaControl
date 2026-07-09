import { useState, useEffect } from 'react'
import { db } from '../lib/storage'
import Modal from '../components/Modal'

export default function MovementsPage() {
  const [movements, setMovements] = useState<any[]>([])
  const [grains, setGrains] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ type: 'entry', grainId: '', warehouseId: '', toWarehouseId: '', quantity: '', supplierId: '', clientId: '', notes: '' })

  useEffect(() => {
    load()
    setGrains(db.grains().getAll())
    setWarehouses(db.warehouses().getAll())
    setSuppliers(db.suppliers().getAll())
    setClients(db.clients().getAll())
  }, [])

  const load = () => setMovements(db.movements().getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const store = db.movements()
    store.set([...store.getAll(), {
      id: 'm' + Date.now(),
      type: form.type,
      grainId: form.grainId,
      warehouseId: form.warehouseId,
      toWarehouseId: form.type === 'transfer' ? form.toWarehouseId : '',
      quantity: Number(form.quantity),
      supplierId: form.type === 'entry' ? form.supplierId : '',
      clientId: form.type === 'exit' ? form.clientId : '',
      notes: form.notes,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
    }])
    load(); setIsOpen(false)
    setForm({ type: 'entry', grainId: '', warehouseId: '', toWarehouseId: '', quantity: '', supplierId: '', clientId: '', notes: '' })
  }

  const getGrainName = (id: string) => grains.find((g) => g.id === id)?.name || id
  const getWarehouseName = (id: string) => warehouses.find((w) => w.id === id)?.name || id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
          <p className="text-sm text-gray-500">Entradas, saídas e transferências</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">+ Nova Movimentação</button>
      </div>
      <div className="rounded-xl bg-white shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grão</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem/Destino</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(m.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 text-xs font-medium ${m.type === 'entry' ? 'bg-green-100 text-green-800' : m.type === 'exit' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Saída' : 'Transf'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{getGrainName(m.grainId)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.quantity.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {m.type === 'transfer' ? `${getWarehouseName(m.warehouseId)} → ${getWarehouseName(m.toWarehouseId)}` : getWarehouseName(m.warehouseId)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {movements.length === 0 && <div className="p-8 text-center text-gray-500">Nenhuma movimentação</div>}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nova Movimentação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500">
              <option value="entry">Entrada</option>
              <option value="exit">Saída</option>
              <option value="transfer">Transferência</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grão</label>
            <select value={form.grainId} onChange={(e) => setForm({ ...form, grainId: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
              <option value="">Selecione...</option>
              {grains.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Armazém</label>
            <select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
              <option value="">Selecione...</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          {form.type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Armazém Destino</label>
              <select value={form.toWarehouseId} onChange={(e) => setForm({ ...form, toWarehouseId: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
                <option value="">Selecione...</option>
                {warehouses.filter((w) => w.id !== form.warehouseId).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          )}
          {form.type === 'entry' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                <option value="">Selecione...</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {form.type === 'exit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                <option value="">Selecione...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Registrar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
