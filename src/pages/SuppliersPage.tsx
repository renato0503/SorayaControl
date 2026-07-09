import { useEffect, useState } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Supplier } from '../types'
import Modal from '../components/Modal'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [form, setForm] = useState({ name: '', document: '', contact: '' })

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), (snap) => {
      setSuppliers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Supplier)))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSupplier) {
      await updateDoc(doc(db, 'suppliers', editingSupplier.id), form)
    } else {
      await addDoc(collection(db, 'suppliers'), { ...form, createdAt: serverTimestamp() })
    }
    setIsModalOpen(false)
    setEditingSupplier(null)
    setForm({ name: '', document: '', contact: '' })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este fornecedor?')) {
      await deleteDoc(doc(db, 'suppliers', id))
    }
  }

  const openEdit = (s: Supplier) => {
    setEditingSupplier(s)
    setForm({ name: s.name, document: s.document, contact: s.contact })
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
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-sm text-gray-500">Cadastro de fornecedores de grãos</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setEditingSupplier(null); setForm({ name: '', document: '', contact: '' }) }}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + Novo Fornecedor
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
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

      {suppliers.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
          Nenhum fornecedor cadastrado
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}>
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
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input
              type="text"
              value={form.document}
              onChange={(e) => setForm({ ...form, document: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contato</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
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
