import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
    {
      name: 'crops',
      type: 'array',
      labels: { singular: 'Independent crop', plural: 'Independent crops' },
      fields: [
        {
          name: 'usage',
          type: 'select',
          required: true,
          options: [
            'homepage-featured-case-study',
            'case-study-hero',
            'case-study-card',
            'blog-thumbnail',
            'blog-hero',
            'client-logo',
            'social-sharing',
          ],
        },
        { name: 'aspectRatio', type: 'select', required: true, options: ['16:9', '4:3', '1:1', '3:4', '4:5', '9:16', 'custom'] },
        { name: 'x', type: 'number', required: true, min: 0, max: 100 },
        { name: 'y', type: 'number', required: true, min: 0, max: 100 },
        { name: 'width', type: 'number', required: true, min: 1, max: 100 },
        { name: 'height', type: 'number', required: true, min: 1, max: 100 },
        { name: 'zoom', type: 'number', defaultValue: 1, min: 0.1, max: 10 },
        { name: 'rotation', type: 'number', defaultValue: 0 },
      ],
    },
  ],
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return headers
    },
  },
}
