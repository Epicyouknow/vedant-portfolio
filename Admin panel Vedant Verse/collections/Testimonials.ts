import type { CollectionConfig } from 'payload'
import { canEditContent, publicPublishedRead } from '@/access/contentAccess'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { group: 'Content', useAsTitle: 'personName' },
  access: {
    create: canEditContent,
    delete: canEditContent,
    read: publicPublishedRead,
    update: canEditContent,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'personName', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
