import type { CollectionConfig } from 'payload'
import { isStaff } from '@/access/contentAccess'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    group: 'Leads',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'type', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    delete: isStaff,
    read: isStaff,
    update: isStaff,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'type', type: 'select', defaultValue: 'contact', options: ['contact', 'consultation', 'newsletter'] },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'in-progress', 'resolved', 'spam'], access: { create: () => false } },
    { name: 'internalNotes', type: 'textarea', access: { create: () => false } },
  ],
}
