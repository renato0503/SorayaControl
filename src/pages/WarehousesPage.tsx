import { useState, useEffect } from 'react'
import { db } from '../lib/storage'
import Modal from '../components/Modal'

export default function WarehousesPage() {
  const [items, setItems] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', location: '', capacity: '' })

  useEffect(() => { load() }, [])

  const load = () => setItems(db.warehouses().getAll())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...form, capacity: Number(form.capacity) }
    const store = db.warehouses()
    if (editing) {
      store.set(store.getAll().map((w) => (w.id === editing.id ? { ...data, id: w.id, createdAt: w.createdAt } : w)))
    } else {
      store.set([...store.getAll(), { ...data, id: 'w' + Date.now(), createdAt: new Date().toISOString() }])
    }
    load(); setIsOpen(false); setEditing(null); setForm({ name: '', location: '', capacity: '' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este armazém?')) {
      db.warehouses().set(db.warehouses().getAll().filter((w) => w.id !== id))
      load()
    }
  }

  const openEdit = (w: any) => { setEditing(w); setForm({ name: w.name, location: w.location, capacity: String(w.capacity) }); setIsOpen(true) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Armazéns</h1>
          <p className="text-sm text-gray-500">Unidades de armazenagem</p>
        </div>
        <button onClick={() => { setIsOpen(true); setEditing(null); setForm({ name: '', location: '', capacity: '' }) }} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">+ Novo Armazém</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((w) => (
          <div key={w.id} className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{w.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => openEdit(w)} className="text-sm text-green-600 hover:text-green-800">Editar</button>
                <button onClick={() => handleDelete(w.id)} className="text-sm text-red-600 hover:text-red-800">Excluir</button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{w.location}</p>
            <p className="text-sm text-gray-700">Capacidade: <span className="font-medium">{w.capacity.toLocaleString()} sc</span></p>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">Nenhum armazém cadastrado</div>}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Editar Armazém' : 'Novo Armazém'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Localização</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacidade (sacas)</label>
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
