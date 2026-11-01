import type { CollectionConfig } from 'payload'
import { canManageSite, publicPublishedRead } from '@/access/contentAccess'
import { contentBlocks } from '@/fields/contentBlocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    create: canManageSite,
    delete: canManageSite,
    read: publicPublishedRead,
    update: canManageSite,
  },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    { name: 'internalDescription', type: 'textarea' },
    {
      name: 'sections',
      type: 'blocks',
      blocks: contentBlocks,
    },
  ],
}
