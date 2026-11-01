import type { GlobalConfig } from 'payload'
import { canManageSite } from '@/access/contentAccess'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Website' },
  access: {
    read: () => true,
    update: canManageSite,
  },
  versions: { drafts: { autosave: true, schedulePublish: true }, max: 50 },
  fields: [
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'sectionType', type: 'select', required: true, options: ['navigation', 'hero', 'client-marquee', 'case-studies', 'logo-wall', 'about', 'timeline', 'process', 'services', 'skills', 'blog', 'testimonials', 'contact', 'footer', 'custom'] },
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'background', type: 'text' },
        { name: 'alignment', type: 'select', defaultValue: 'left', options: ['left', 'center', 'right'] },
        { name: 'spacing', type: 'select', defaultValue: 'comfortable', options: ['compact', 'comfortable', 'spacious'] },
        { name: 'animation', type: 'select', defaultValue: 'fade-up', options: ['none', 'fade', 'fade-up', 'slide', 'scale'] },
        { name: 'desktopVisible', type: 'checkbox', defaultValue: true },
        { name: 'tabletVisible', type: 'checkbox', defaultValue: true },
        { name: 'mobileVisible', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
