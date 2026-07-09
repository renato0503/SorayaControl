import { useState, useEffect } from 'react'
import { db } from '../lib/storage'
import Modal from '../components/Modal'

export default function GrainsPage() {
  const [grains, setGrains] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', unit: 'sc' })

  useEffect(() => { load() }, [])

  const load = () => setGrains(db.grains().getAll())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const store = db.grains()
    if (editing) {
      store.set(store.getAll().map((g) => (g.id === editing.id ? { ...form, id: g.id, createdAt: g.createdAt } : g)))
    } else {
      store.set([...store.getAll(), { ...form, id: 'g' + Date.now(), createdAt: new Date().toISOString() }])
    }
    load(); setIsOpen(false); setEditing(null); setForm({ name: '', unit: 'sc' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este grão?')) {
      db.grains().set(db.grains().getAll().filter((g) => g.id !== id))
      load()
    }
  }

  const openEdit = (g: any) => { setEditing(g); setForm({ name: g.name, unit: g.unit }); setIsOpen(true) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grãos</h1>
          <p className="text-sm text-gray-500">Cadastro de tipos de grãos</p>
        </div>
        <button onClick={() => { setIsOpen(true); setEditing(null); setForm({ name: '', unit: 'sc' }) }} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">+ Novo Grão</button>
      </div>
      <div className="rounded-xl bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grains.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{g.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{g.unit}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button onClick={() => openEdit(g)} className="text-green-600 hover:text-green-800 mr-4">Editar</button>
                  <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {grains.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum grão cadastrado</div>}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Editar Grão' : 'Novo Grão'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unidade</label>
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500">
              <option value="sc">Saca (sc)</option>
              <option value="kg">Quilograma (kg)</option>
              <option value="tonnes">Tonelada (t)</option>
              <option value="bushels">Bushel (bu)</option>
            </select>
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
