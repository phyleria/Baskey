import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ContributionForm({ poolId }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    isAnonymous: false
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/pools/${poolId}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to payment URL
        window.location.href = data.paymentUrl
      } else {
        alert(data.message || 'Failed to initiate payment')
      }
    } catch (error) {
      console.error('Contribution error:', error)
      alert('An error occurred while processing your contribution')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
        <select
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="KES">KES</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="anonymous"
          checked={formData.isAnonymous}
          onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
          Make this contribution anonymous
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-2 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: '#E55F1A' }}
      >
        {loading ? 'Processing...' : 'Contribute'}
      </button>
    </form>
  )
}