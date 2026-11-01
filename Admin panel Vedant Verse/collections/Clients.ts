import type { CollectionConfig } from 'payload'
import { canEditContent, publicPublishedRead } from '@/access/contentAccess'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'industry', 'featured', 'marqueeVisible', '_status'],
  },
  access: {
    create: canEditContent,
    delete: canEditContent,
    read: publicPublishedRead,
    update: canEditContent,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'websiteURL', type: 'text' },
    { name: 'industry', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'campaignObjective', type: 'text' },
    { name: 'platforms', type: 'select', hasMany: true, options: ['Meta', 'Google', 'LinkedIn', 'YouTube', 'TikTok'] },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'marqueeVisible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'logoWallVisible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'marqueeOrder', type: 'number', min: 0, admin: { position: 'sidebar' } },
  ],
}
