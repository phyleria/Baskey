import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query
    const { amount, currency, isAnonymous } = req.body

    const pool = await prisma.birthdayPool.findUnique({
      where: { id }
    })

    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' })
    }

    // Create contribution record
    const contribution = await prisma.contribution.create({
      data: {
        amount: parseFloat(amount),
        currency,
        isAnonymous,
        contributorId: session.user.id,
        poolId: id,
      }
    })

    // Initialize payment with Chimoney
    const chimoneyResponse = await axios.post(
      `${process.env.CHIMONEY_API_URL}/payment/initiate`,
      {
        amount: parseFloat(amount),
        currency,
        description: `Contribution to ${pool.name}`,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/pools/${id}/payment-success`,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payment`,
        reference: contribution.id,
      },
      {
        headers: {
          'X-API-KEY': process.env.CHIMONEY_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    // Update contribution with payment ID
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { paymentId: chimoneyResponse.data.data.id }
    })

    res.status(200).json({
      paymentUrl: chimoneyResponse.data.data.payment_url,
      contributionId: contribution.id,
    })
  } catch (error) {
    console.error('Contribution error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}