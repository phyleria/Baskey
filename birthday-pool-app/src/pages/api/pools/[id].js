import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const pool = await prisma.birthdayPool.findUnique({
        where: { id },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          contributions: {
            include: {
              contributor: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          invitations: {
            include: {
              invitedBy: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        }
      })

      if (!pool) {
        return res.status(404).json({ message: 'Pool not found' })
      }

      res.status(200).json({ pool })
    } catch (error) {
      console.error('Get pool error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}