import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

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

    const { name, targetAmount, currency, birthdayDate, birthdayEmail } = req.body

    const pool = await prisma.birthdayPool.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currency,
        birthdayDate: new Date(birthdayDate),
        birthdayEmail,
        creatorId: session.user.id,
      }
    })

    res.status(201).json({ pool })
  } catch (error) {
    console.error('Create pool error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

