import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Warehouse } from '../types'
import Modal from '../components/Modal'

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [form, setForm] = useState({ name: '', location: '', capacity: '' })

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'warehouses'), (snap) => {
      setWarehouses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Warehouse)))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...form, capacity: Number(form.capacity) }
    if (editingWarehouse) {
      await updateDoc(doc(db, 'warehouses', editingWarehouse.id), data)
    } else {
      await addDoc(collection(db, 'warehouses'), { ...data, createdAt: serverTimestamp() })
    }
    setIsModalOpen(false)
    setEditingWarehouse(null)
    setForm({ name: '', location: '', capacity: '' })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este armazém?')) {
      await deleteDoc(doc(db, 'warehouses', id))
    }
  }

  const openEdit = (w: Warehouse) => {
    setEditingWarehouse(w)
    setForm({ name: w.name, location: w.location, capacity: String(w.capacity) })
    setIsModalOpen(true)
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Armazéns</h1>
          <p className="text-sm text-gray-500">Cadastro de unidades de armazenagem</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setEditingWarehouse(null); setForm({ name: '', location: '', capacity: '' }) }}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + Novo Armazém
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((w) => (
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

      {warehouses.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
          Nenhum armazém cadastrado
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingWarehouse ? 'Editar Armazém' : 'Novo Armazém'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Localização</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacidade (sacas)</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
