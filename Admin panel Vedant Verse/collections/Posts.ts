import type { CollectionConfig } from 'payload'
import { canEditPosts, publicPublishedRead } from '@/access/contentAccess'
import { contentBlocks } from '@/fields/contentBlocks'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'assignedTo', '_status', 'updatedAt'],
  },
  access: {
    create: canEditPosts,
    delete: canEditPosts,
    read: publicPublishedRead,
    update: canEditPosts,
  },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'assignedTo', type: 'relationship', relationTo: 'admins', admin: { position: 'sidebar' } },
    { name: 'publicationDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'readingTime', type: 'number', min: 1, admin: { position: 'sidebar' } },
    { name: 'category', type: 'text', admin: { position: 'sidebar' } },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'relatedCaseStudy', type: 'relationship', relationTo: 'case-studies' },
    { name: 'relatedClients', type: 'relationship', relationTo: 'clients', hasMany: true },
    { name: 'content', type: 'blocks', blocks: contentBlocks },
    {
      name: 'aeo',
      type: 'group',
      label: 'AI search optimization',
      fields: [
        { name: 'directAnswer', type: 'textarea' },
        { name: 'questions', type: 'array', fields: [
          { name: 'question', type: 'text', required: true },
          { name: 'structuredAnswer', type: 'textarea', required: true },
        ] },
        { name: 'entityReferences', type: 'array', fields: [{ name: 'entity', type: 'text' }] },
        { name: 'authorInformation', type: 'textarea' },
      ],
    },
  ],
}
