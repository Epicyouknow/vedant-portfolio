import type { Access } from 'payload'

type AdminRole = 'owner' | 'admin' | 'editor' | 'blog-contributor' | 'viewer'

const roleOf = (user: unknown): AdminRole | undefined =>
  (user as { role?: AdminRole } | null)?.role

export const isStaff: Access = ({ req }) => Boolean(req.user?.collection === 'admins')

export const canManageSite: Access = ({ req }) => {
  if (req.user?.collection !== 'admins') return false
  const role = roleOf(req.user)
  return !role || role === 'owner' || role === 'admin'
}

export const canEditContent: Access = ({ req }) => {
  if (req.user?.collection !== 'admins') return false
  const role = roleOf(req.user)
  return !role || ['owner', 'admin', 'editor'].includes(role)
}

export const canEditPosts: Access = ({ req }) => {
  if (req.user?.collection !== 'admins') return false
  const role = roleOf(req.user)
  if (!role || ['owner', 'admin', 'editor'].includes(role)) return true
  if (role === 'blog-contributor') {
    return {
      assignedTo: { equals: req.user.id },
    }
  }
  return false
}

export const publicPublishedRead: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return { _status: { equals: 'published' } }
}
