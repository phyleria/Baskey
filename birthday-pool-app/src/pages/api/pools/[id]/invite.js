import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

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
    const { emails } = req.body

    const pool = await prisma.birthdayPool.findUnique({
      where: { id },
      include: { creator: true }
    })

    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' })
    }

    // Check if user is the creator
    if (pool.creatorId !== session.user.id) {
      return res.status(403).json({ message: 'Only pool creator can invite friends' })
    }

    // Create invitations
    const invitations = await Promise.all(
      emails.map(async (email) => {
        const token = crypto.randomBytes(32).toString('hex')
        
        return prisma.invitation.create({
          data: {
            email,
            token,
            poolId: id,
            invitedById: session.user.id,
          }
        })
      })
    )

    // Send invitation emails
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await Promise.all(
      invitations.map(async (invitation) => {
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pools/${id}/join?token=${invitation.token}`
        
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: invitation.email,
          subject: `You're invited to contribute to ${pool.name}`,
          html: `
            <h2>You're invited to contribute to ${pool.name}!</h2>
            <p>Click the link below to join the birthday pool:</p>
            <a href="${inviteUrl}">Join Birthday Pool</a>
          `,
        })
      })
    )

    res.status(200).json({ message: 'Invitations sent successfully' })
  } catch (error) {
    console.error('Invite error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
