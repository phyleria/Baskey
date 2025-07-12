import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function PoolCard({ pool }) {
  const progressPercentage = (pool.totalCollected / pool.targetAmount) * 100
  const timeUntilBirthday = formatDistanceToNow(new Date(pool.birthdayDate), { addSuffix: true })

  return (
    <div className="card p-6 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{pool.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🎂 {timeUntilBirthday}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-birthday-green">
            ${pool.totalCollected.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">of ${pool.targetAmount.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Progress</span>
          <span className="font-semibold">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill bg-gradient-to-r from-birthday-green to-birthday-yellow"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-flex items-center">
              👥 {pool.contributions?.length || 0} contributor{pool.contributions?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-flex items-center">
              💰 {pool.currency}
            </span>
          </div>
        </div>
        <Link
          href={`/pools/${pool.id}`}
          className="btn-accent text-sm px-6 py-2"
        >
          View Pool
        </Link>
      </div>
    </div>
  )
}
