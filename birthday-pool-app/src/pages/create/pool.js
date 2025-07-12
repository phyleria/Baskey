import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '../../components/Layout'

export default function CreatePool() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currency: 'USD',
    birthdayDate: '',
    birthdayEmail: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pools/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/pools/${data.pool.id}`)
      } else {
        alert(data.message || 'Failed to create pool')
      }
    } catch (error) {
      console.error('Create pool error:', error)
      alert('An error occurred while creating the pool')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Create a Birthday Pool</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Target Amount</label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="USD">USD</option>
              <option value="KES">KES</option>
              <option value="NGN">NGN</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Birthday Date</label>
            <input
              type="date"
              value={formData.birthdayDate}
              onChange={(e) => setFormData({ ...formData, birthdayDate: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Birthday Person's Email</label>
            <input
              type="email"
              value={formData.birthdayEmail}
              onChange={(e) => setFormData({ ...formData, birthdayEmail: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded font-semibold"
          >
            {loading ? 'Creating...' : 'Create Pool'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
