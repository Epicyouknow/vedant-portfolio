import type { CollectionConfig } from 'payload'
import { canEditContent, publicPublishedRead } from '@/access/contentAccess'
import { contentBlocks } from '@/fields/contentBlocks'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    group: 'Content',
    useAsTitle: 'campaignName',
    defaultColumns: ['campaignName', 'client', 'objective', '_status', 'updatedAt'],
  },
  access: {
    create: canEditContent,
    delete: canEditContent,
    read: publicPublishedRead,
    update: canEditContent,
  },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 },
  fields: [
    { name: 'campaignName', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'campaignName' },
    { name: 'client', type: 'relationship', relationTo: 'clients', required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'clientWebsite', type: 'text' },
    { name: 'industry', type: 'text' },
    { name: 'category', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'duration', type: 'text' },
    { name: 'objective', type: 'text' },
    { name: 'platforms', type: 'select', hasMany: true, options: ['Meta', 'Google', 'LinkedIn', 'YouTube', 'TikTok'] },
    { name: 'role', type: 'text' },
    {
      name: 'story',
      type: 'group',
      fields: [
        { name: 'background', type: 'richText' },
        { name: 'challenge', type: 'richText' },
        { name: 'objectives', type: 'richText' },
        { name: 'strategy', type: 'richText' },
        { name: 'execution', type: 'richText' },
        { name: 'optimization', type: 'richText' },
        { name: 'results', type: 'richText' },
        { name: 'learnings', type: 'richText' },
        { name: 'nextSteps', type: 'richText' },
      ],
    },
    {
      name: 'metrics',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'unit', type: 'text' },
        { name: 'comparisonPeriod', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'visible', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'pageBlocks', type: 'blocks', blocks: contentBlocks },
  ],
}
