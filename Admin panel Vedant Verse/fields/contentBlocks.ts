import type { Block } from 'payload'

export const contentBlocks: Block[] = [
  {
    slug: 'richText',
    labels: { singular: 'Text', plural: 'Text sections' },
    fields: [
      { name: 'eyebrow', type: 'text' },
      { name: 'heading', type: 'text' },
      { name: 'body', type: 'richText' },
      { name: 'alignment', type: 'select', defaultValue: 'left', options: ['left', 'center'] },
    ],
  },
  {
    slug: 'image',
    fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true },
      { name: 'caption', type: 'text' },
      {
        name: 'aspectRatio',
        type: 'select',
        defaultValue: '16:9',
        options: ['16:9', '4:3', '1:1', '3:4', '4:5', '9:16', 'custom'],
      },
    ],
  },
  {
    slug: 'metrics',
    fields: [
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true },
          { name: 'value', type: 'text', required: true },
          { name: 'unit', type: 'text' },
          { name: 'comparison', type: 'text' },
          { name: 'description', type: 'textarea' },
          { name: 'visible', type: 'checkbox', defaultValue: true },
        ],
      },
    ],
  },
  {
    slug: 'gallery',
    fields: [
      {
        name: 'images',
        type: 'array',
        fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
      },
    ],
  },
  {
    slug: 'quote',
    fields: [
      { name: 'quote', type: 'textarea', required: true },
      { name: 'attribution', type: 'text' },
    ],
  },
  {
    slug: 'callout',
    fields: [
      { name: 'heading', type: 'text' },
      { name: 'body', type: 'textarea' },
      { name: 'label', type: 'text' },
      { name: 'destination', type: 'text' },
    ],
  },
  {
    slug: 'faq',
    fields: [
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'question', type: 'text', required: true },
          { name: 'answer', type: 'textarea', required: true },
        ],
      },
    ],
  },
]
