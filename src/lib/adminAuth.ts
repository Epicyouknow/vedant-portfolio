export type AdminRole = 'Owner' | 'Admin' | 'Editor' | 'Blog Contributor' | 'Viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

export const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Vedant Tiwari',
    email: 'vedant@vedantverse.com',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'user-2',
    name: 'Priya Shah',
    email: 'priya@vedantverse.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 'user-3',
    name: 'Arjun Mehta',
    email: 'arjun@media.in',
    role: 'Blog Contributor',
    status: 'Invited',
    lastActive: 'Yesterday',
  },
  {
    id: 'user-4',
    name: 'Client Reviewer',
    email: 'reviewer@client.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '3 days ago',
  },
];

export function canPublish(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin';
}

export function canEditCaseStudies(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin' || role === 'Editor';
}

export function canEditBlogs(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin' || role === 'Editor' || role === 'Blog Contributor';
}

export function canManageUsers(role: AdminRole): boolean {
  return role === 'Owner';
}

export function canManageSettings(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin';
}

