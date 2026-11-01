import type { GlobalConfig } from 'payload'
import { canManageSite } from '@/access/contentAccess'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Website' },
  access: { read: () => true, update: canManageSite },
  versions: { max: 30 },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'VEDANTVERSE' },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'accentColor', type: 'text', defaultValue: '#ED463B' },
        { name: 'headingFont', type: 'text', defaultValue: 'Manrope' },
        { name: 'bodyFont', type: 'text', defaultValue: 'Inter' },
        { name: 'radius', type: 'number', defaultValue: 12 },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'destination', type: 'text', required: true },
        { name: 'desktopVisible', type: 'checkbox', defaultValue: true },
        { name: 'mobileVisible', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        { name: 'brandDescription', type: 'textarea' },
        { name: 'email', type: 'email' },
        { name: 'copyright', type: 'text' },
        { name: 'newsletterEnabled', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'marquee',
      type: 'group',
      fields: [
        { name: 'speed', type: 'number', defaultValue: 30 },
        { name: 'direction', type: 'select', defaultValue: 'left', options: ['left', 'right'] },
        { name: 'spacing', type: 'number', defaultValue: 48 },
        { name: 'logoSize', type: 'number', defaultValue: 96 },
        { name: 'pauseOnHover', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'popup',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'firstDisplaySeconds', type: 'number', defaultValue: 5 },
        { name: 'secondDisplaySeconds', type: 'number', defaultValue: 27 },
        { name: 'thirdDisplaySeconds', type: 'number', defaultValue: 300 },
        { name: 'exitIntent', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
