import { useState, useEffect } from 'react'
import { db } from '../lib/storage'
import Modal from '../components/Modal'

export default function SuppliersPage() {
  const [items, setItems] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', document: '', contact: '' })

  useEffect(() => { load() }, [])

  const load = () => setItems(db.suppliers().getAll())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const store = db.suppliers()
    if (editing) {
      store.set(store.getAll().map((s) => (s.id === editing.id ? { ...form, id: s.id, createdAt: s.createdAt } : s)))
    } else {
      store.set([...store.getAll(), { ...form, id: 's' + Date.now(), createdAt: new Date().toISOString() }])
    }
    load(); setIsOpen(false); setEditing(null); setForm({ name: '', document: '', contact: '' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este fornecedor?')) {
      db.suppliers().set(db.suppliers().getAll().filter((s) => s.id !== id))
      load()
    }
  }

  const openEdit = (s: any) => { setEditing(s); setForm({ name: s.name, document: s.document, contact: s.contact }); setIsOpen(true) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-sm text-gray-500">Cadastro de fornecedores de grãos</p>
        </div>
        <button onClick={() => { setIsOpen(true); setEditing(null); setForm({ name: '', document: '', contact: '' }) }} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">+ Novo Fornecedor</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="text-sm text-green-600 hover:text-green-800">Editar</button>
                <button onClick={() => handleDelete(s.id)} className="text-sm text-red-600 hover:text-red-800">Excluir</button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Documento: <span className="font-medium text-gray-700">{s.document}</span></p>
            <p className="text-sm text-gray-500">Contato: <span className="font-medium text-gray-700">{s.contact}</span></p>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">Nenhum fornecedor</div>}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}>
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
