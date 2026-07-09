import { useState, useEffect } from 'react'
import { db } from '../lib/storage'
import Modal from '../components/Modal'

export default function ClientsPage() {
  const [items, setItems] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', document: '', contact: '' })

  useEffect(() => { load() }, [])

  const load = () => setItems(db.clients().getAll())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const store = db.clients()
    if (editing) {
      store.set(store.getAll().map((c) => (c.id === editing.id ? { ...form, id: c.id, createdAt: c.createdAt } : c)))
    } else {
      store.set([...store.getAll(), { ...form, id: 'c' + Date.now(), createdAt: new Date().toISOString() }])
    }
    load(); setIsOpen(false); setEditing(null); setForm({ name: '', document: '', contact: '' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este cliente?')) {
      db.clients().set(db.clients().getAll().filter((c) => c.id !== id))
      load()
    }
  }

  const openEdit = (c: any) => { setEditing(c); setForm({ name: c.name, document: c.document, contact: c.contact }); setIsOpen(true) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">Cadastro de clientes</p>
        </div>
        <button onClick={() => { setIsOpen(true); setEditing(null); setForm({ name: '', document: '', contact: '' }) }} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">+ Novo Cliente</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{c.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-sm text-green-600 hover:text-green-800">Editar</button>
                <button onClick={() => handleDelete(c.id)} className="text-sm text-red-600 hover:text-red-800">Excluir</button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Documento: <span className="font-medium text-gray-700">{c.document}</span></p>
            <p className="text-sm text-gray-500">Contato: <span className="font-medium text-gray-700">{c.contact}</span></p>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">Nenhum cliente</div>}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input type="text" value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contato</label>
            <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
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
