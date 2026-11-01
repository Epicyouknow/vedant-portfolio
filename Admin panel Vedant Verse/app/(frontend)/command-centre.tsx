'use client'

import { useMemo, useState, useTransition, type ReactNode } from 'react'
import { saveHomepageHero } from './actions'

type Screen =
  | 'Dashboard'
  | 'Website Overview'
  | 'Activity Log'
  | 'Homepage Editor'
  | 'Case Studies'
  | 'Case Study Editor'
  | 'Case Study Block Builder'
  | 'Blog Manager'
  | 'Blog Editor'
  | 'SEO Editor'
  | 'Pages Manager'
  | 'Client Directory'
  | 'Client Logo Manager'
  | 'Media Library'
  | 'Image Crop Editor'
  | 'Testimonials'
  | 'Experience & Journey'
  | 'Services'
  | 'Contact Section'
  | 'Theme Settings'
  | 'Navigation Manager'
  | 'Section Manager'
  | 'Footer Editor'
  | 'Animation Controls'
  | 'Responsive Settings'
  | 'SEO & AEO Dashboard'
  | 'Form Submissions'
  | 'Popup Manager'
  | 'User Management'
  | 'Roles & Permissions'
  | 'Version History'
  | 'Live Website Preview'
  | 'System Settings'
  | 'Admin Login'

type IconName =
  | 'dashboard' | 'page' | 'activity' | 'home' | 'briefcase' | 'edit' | 'book'
  | 'users' | 'image' | 'quote' | 'timeline' | 'spark' | 'mail' | 'palette'
  | 'menu' | 'layers' | 'footer' | 'motion' | 'devices' | 'search' | 'form'
  | 'popup' | 'settings' | 'chevron' | 'plus' | 'arrow' | 'more' | 'check'
  | 'clock' | 'eye' | 'upload' | 'bell' | 'sun' | 'link' | 'trash' | 'copy'
  | 'crop' | 'rotate' | 'undo' | 'filter' | 'save' | 'publish' | 'close'
  | 'lock' | 'globe' | 'mobile' | 'desktop'

const paths: Record<IconName, ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  page: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
  activity: <path d="M3 12h4l2-7 4 14 2-7h6"/>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-6h6v6"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
  edit: <><path d="m4 20 4-1 11-11-3-3L5 16z"/><path d="m14 6 3 3"/></>,
  book: <><path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4z"/></>,
  users: <><circle cx="9" cy="8" r="4"/><path d="M2 21v-2a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v2M16 4a4 4 0 0 1 0 8M18 14a5 5 0 0 1 4 5v2"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-5 4 4 3-3 6 6"/></>,
  quote: <path d="M5 17h4l2-5V6H5v7h4M14 17h4l2-5V6h-6v7h4"/>,
  timeline: <><path d="M5 3v18"/><circle cx="5" cy="7" r="2"/><circle cx="5" cy="16" r="2"/><path d="M9 7h11M9 16h8"/></>,
  spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12z"/><circle cx="7" cy="10" r="1"/><circle cx="9" cy="6" r="1"/><circle cx="14" cy="6" r="1"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  footer: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 16h18M7 19h4"/></>,
  motion: <><path d="M3 8h10a4 4 0 1 0-4-4M3 12h15a3 3 0 1 1-3 3M3 16h5"/></>,
  devices: <><rect x="2" y="4" width="14" height="11" rx="2"/><path d="M7 20h4M9 15v5"/><rect x="18" y="8" width="4" height="10" rx="1"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  form: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  popup: <><rect x="3" y="4" width="18" height="16" rx="2"/><rect x="7" y="8" width="10" height="8" rx="1"/><path d="m14 10 1 1-1 1"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  arrow: <path d="M5 12h14M14 7l5 5-5 5"/>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12"/><circle cx="12" cy="12" r="3"/></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
  bell: <><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z"/><path d="M10 20h4"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></>,
  link: <><path d="M10 13a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.5-5.5l-2 2"/><path d="M14 11a4 4 0 0 0-6-.5l-3 3A4 4 0 0 0 10.5 19l2-2"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></>,
  crop: <><path d="M6 2v16a2 2 0 0 0 2 2h14M2 6h16a2 2 0 0 1 2 2v14"/></>,
  rotate: <><path d="M4 8V3l3 3a8 8 0 1 1-2 9"/></>,
  undo: <><path d="m9 7-5 5 5 5"/><path d="M4 12h9a6 6 0 0 1 6 6"/></>,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8z"/>,
  save: <><path d="M5 3h12l2 2v16H5z"/><path d="M8 3v6h8V3M8 21v-8h8v8"/></>,
  publish: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 14v6h14v-6"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
  mobile: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>,
  desktop: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Button({ children, icon, variant = 'primary', onClick, disabled, type = 'button' }: {
  children: ReactNode; icon?: IconName; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'
}) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`vv-button vv-button--${variant}`}>{icon && <Icon name={icon} size={16}/>}<span>{children}</span></button>
}

function Field({ label, value, onChange, helper }: { label: string; value: string; onChange?: (value: string) => void; helper?: string }) {
  return <label className="grid gap-2 text-sm font-medium text-[var(--ink)]"><span>{label}</span><input value={value} onChange={(event) => onChange?.(event.target.value)} readOnly={!onChange} className="vv-input"/>{helper && <span className="text-xs font-normal text-[var(--muted)]">{helper}</span>}</label>
}

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent' }) {
  return <span className={`vv-badge vv-badge--${tone}`}>{children}</span>
}

const navGroups: { label: string; items: { label: Screen; icon: IconName }[] }[] = [
  { label: 'Overview', items: [
    { label: 'Dashboard', icon: 'dashboard' }, { label: 'Website Overview', icon: 'page' }, { label: 'Activity Log', icon: 'activity' },
  ]},
  { label: 'Content management', items: [
    { label: 'Homepage Editor', icon: 'home' }, { label: 'Case Studies', icon: 'briefcase' }, { label: 'Blog Manager', icon: 'book' },
    { label: 'Pages Manager', icon: 'page' }, { label: 'Client Directory', icon: 'users' }, { label: 'Media Library', icon: 'image' },
    { label: 'Testimonials', icon: 'quote' }, { label: 'Experience & Journey', icon: 'timeline' }, { label: 'Services', icon: 'spark' }, { label: 'Contact Section', icon: 'mail' },
  ]},
  { label: 'Website design', items: [
    { label: 'Theme Settings', icon: 'palette' }, { label: 'Navigation Manager', icon: 'menu' }, { label: 'Section Manager', icon: 'layers' },
    { label: 'Footer Editor', icon: 'footer' }, { label: 'Animation Controls', icon: 'motion' }, { label: 'Responsive Settings', icon: 'devices' },
  ]},
  { label: 'SEO & discoverability', items: [{ label: 'SEO & AEO Dashboard', icon: 'search' }, { label: 'SEO Editor', icon: 'edit' }] },
  { label: 'Lead management', items: [{ label: 'Form Submissions', icon: 'form' }, { label: 'Popup Manager', icon: 'popup' }] },
  { label: 'Settings', items: [
    { label: 'User Management', icon: 'users' }, { label: 'Roles & Permissions', icon: 'lock' },
    { label: 'Version History', icon: 'activity' }, { label: 'System Settings', icon: 'settings' },
  ]},
]

const dashboardStats = [
  ['Total website pages', '12', '+2 this month'], ['Published case studies', '08', '2 drafts'],
  ['Published blogs', '24', '+4 this month'], ['Draft content', '06', 'Needs review'],
  ['Total client profiles', '18', '16 visible'], ['New contact enquiries', '07', '+23% vs last week'],
]

const activities = [
  ['Homepage hero edited', 'Vedant', '4 min ago', 'edit'],
  ['“Scaling D2C growth” published', 'Vedant', '46 min ago', 'publish'],
  ['New blog draft created', 'Priya S.', '2 hr ago', 'book'],
  ['Nike India case study updated', 'Vedant', 'Yesterday', 'briefcase'],
  ['Hero image crop replaced', 'Vedant', 'Yesterday', 'image'],
]

const contentRows = {
  'Blog Manager': [
    ['The Modern Performance Marketing Playbook', 'Strategy', 'Published', 'Today, 09:42'],
    ['Why Creative Testing Is Your Growth Engine', 'Creative', 'Draft', 'Yesterday, 18:06'],
    ['A Practical Guide to Paid Social Attribution', 'Analytics', 'Scheduled', '24 May, 11:30'],
    ['Building a Full-Funnel Media System', 'Growth', 'Published', '18 May, 14:12'],
  ],
  'Case Studies': [
    ['Nike India — Always On Performance', 'Retail', 'Published', 'Today, 08:14'],
    ['Cult.fit — New Member Acquisition', 'Health & fitness', 'Draft', 'Yesterday, 20:44'],
    ['Razorpay — Demand Generation', 'Fintech', 'Published', '20 May, 10:18'],
    ['The Whole Truth — D2C Scale', 'FMCG', 'Scheduled', '19 May, 16:04'],
  ],
}

function Sidebar({ screen, setScreen, collapsed, setCollapsed }: { screen: Screen; setScreen: (screen: Screen) => void; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  return <aside className={`vv-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
    <div className="flex h-20 items-center gap-3 border-b border-[var(--line)] px-5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--ink)] text-sm font-bold text-white">V</div>
      {!collapsed && <div className="min-w-0"><div className="text-[13px] font-extrabold tracking-[.12em]">VEDANTVERSE</div><div className="text-[10px] text-[var(--muted)]">Website Control Centre</div></div>}
      <button className="ml-auto hidden rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] lg:block" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar"><Icon name={collapsed ? 'arrow' : 'menu'} size={17}/></button>
    </div>
    <div className="vv-sidebar-scroll">
      {navGroups.map((group) => <div className="mb-5" key={group.label}>
        {!collapsed && <div className="mb-2 px-4 text-[9px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">{group.label}</div>}
        <div className="grid gap-0.5 px-2">
          {group.items.map((item) => <button title={item.label} key={item.label} onClick={() => setScreen(item.label)} className={`vv-nav-item ${screen === item.label ? 'is-active' : ''}`}>
            <Icon name={item.icon}/>{!collapsed && <span className="truncate">{item.label}</span>}
          </button>)}
        </div>
      </div>)}
    </div>
    <div className="border-t border-[var(--line)] p-3">
      <button className="vv-nav-item w-full" onClick={() => setScreen('Admin Login')}><div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent)]">VS</div>{!collapsed && <><span className="min-w-0 flex-1 truncate text-left">Vedant Sharma</span><Icon name="more" size={15}/></>}</button>
    </div>
  </aside>
}

function Header({ screen, setScreen, toggleTheme }: { screen: Screen; setScreen: (screen: Screen) => void; toggleTheme: () => void }) {
  return <header className="vv-header">
    <div className="flex min-w-0 items-center gap-3">
      <button className="rounded-lg p-2 lg:hidden"><Icon name="menu"/></button>
      <div className="hidden text-sm text-[var(--muted)] sm:block">VedantVerse</div><div className="hidden text-[var(--line-strong)] sm:block">/</div>
      <div className="truncate text-sm font-semibold">{screen}</div>
    </div>
    <div className="flex items-center gap-2">
      <div className="vv-search hidden xl:flex"><Icon name="search" size={16}/><span>Search anything…</span><kbd>⌘ K</kbd></div>
      <button className="vv-icon-button" onClick={toggleTheme} aria-label="Toggle theme"><Icon name="sun"/></button>
      <button className="vv-icon-button relative" aria-label="Notifications"><Icon name="bell"/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"/></button>
      <button className="vv-site-status hidden md:flex" onClick={() => setScreen('Website Overview')}><span className="h-2 w-2 rounded-full bg-[var(--success)]"/>Website live</button>
      <Button variant="secondary" icon="eye" onClick={() => setScreen('Live Website Preview')}>View site</Button>
    </div>
  </header>
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>{eyebrow && <div className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]">{eyebrow}</div>}<div className="vv-h1">{title}</div><div className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">{description}</div></div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
}

function Dashboard({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <>
    <PageHeading eyebrow="Tuesday, 21 May" title="Good morning, Vedant." description="Your digital portfolio, all under control." actions={<><Badge tone="neutral">Demo analytics</Badge><Button icon="plus" onClick={() => setScreen('Blog Editor')}>Create content</Button></>}/>
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {dashboardStats.map(([label, value, note], index) => <div className="vv-card p-4" key={label}><div className="mb-5 flex items-start justify-between"><span className="text-xs text-[var(--muted)]">{label}</span><span className={`h-1.5 w-1.5 rounded-full ${index === 3 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}/></div><div className="text-3xl font-semibold tracking-tight">{value}</div><div className="mt-1 text-[11px] text-[var(--muted)]">{note}</div></div>)}
    </div>
    <div className="grid gap-5 2xl:grid-cols-[1.35fr_.65fr]">
      <div className="grid gap-5">
        <section className="vv-card p-5">
          <div className="mb-4 flex items-center justify-between"><div><div className="vv-h2">Website health</div><div className="text-xs text-[var(--muted)]">Live checks and publishing status</div></div><Badge tone="success">All systems healthy</Badge></div>
          <div className="grid gap-3 md:grid-cols-3">
            {[['Last published', 'Today, 09:42', 'Vedant'], ['SEO coverage', '94%', '3 items need attention'], ['Pending changes', '4 drafts', 'Last saved 4 min ago']].map(([a,b,c]) => <div className="rounded-xl bg-[var(--surface-2)] p-4" key={a}><div className="text-xs text-[var(--muted)]">{a}</div><div className="mt-2 text-lg font-semibold">{b}</div><div className="mt-1 text-[11px] text-[var(--muted)]">{c}</div></div>)}
          </div>
        </section>
        <section className="vv-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] p-5"><div><div className="vv-h2">Recent activity</div><div className="text-xs text-[var(--muted)]">Changes across your workspace</div></div><Button variant="ghost" onClick={() => setScreen('Activity Log')}>View all</Button></div>
          {activities.map(([title,user,time,icon]) => <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-3.5 last:border-0" key={title}><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)]"><Icon name={icon as IconName} size={16}/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{title}</div><div className="text-[11px] text-[var(--muted)]">{user}</div></div><div className="text-[11px] text-[var(--muted)]">{time}</div></div>)}
        </section>
      </div>
      <section className="vv-card h-fit p-5">
        <div className="mb-4"><div className="vv-h2">Quick actions</div><div className="text-xs text-[var(--muted)]">Jump back into your work</div></div>
        <div className="grid gap-2">
          {[
            ['Create new blog', 'book', 'Blog Editor'], ['Add case study', 'briefcase', 'Case Study Editor'],
            ['Edit homepage', 'home', 'Homepage Editor'], ['Upload media', 'upload', 'Media Library'],
            ['Manage clients', 'users', 'Client Directory'], ['View submissions', 'mail', 'Form Submissions'],
          ].map(([label,icon,target]) => <button className="vv-action-row" key={label} onClick={() => setScreen(target as Screen)}><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon name={icon as IconName} size={16}/></span><span className="flex-1 text-left text-sm font-medium">{label}</span><Icon name="chevron" size={15}/></button>)}
        </div>
      </section>
    </div>
  </>
}

function PublishingBar({ dirty, saving, onSave, onPreview, onPublish }: { dirty: boolean; saving: boolean; onSave: () => void; onPreview: () => void; onPublish: () => void }) {
  return <div className="vv-publish-bar"><div className="flex items-center gap-2 text-xs"><span className={`h-2 w-2 rounded-full ${dirty ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}/><span className="font-semibold">{dirty ? 'Unsaved changes' : 'Saved'}</span><span className="hidden text-[var(--muted)] sm:inline">Last saved at 09:42</span></div><div className="flex gap-2"><Button variant="ghost" onClick={onPreview}>Discard</Button><Button variant="secondary" icon="eye" onClick={onPreview}>Preview</Button><Button variant="secondary" icon="save" disabled={saving} onClick={onSave}>{saving ? 'Saving…' : 'Save changes'}</Button><Button icon="publish" onClick={onPublish}>Publish</Button></div></div>
}

const homepageSections = ['Navigation','Hero','Client Marquee','Featured Case Studies','Client Logo Wall','About / Introduction','Experience Timeline','Growth Process','Services','Skills & Platforms','Blog Highlights','Testimonials','Contact CTA','Footer']

function HomepageEditor({ setScreen, openPublish, toast }: { setScreen: (screen: Screen) => void; openPublish: (publishAction: () => void) => void; toast: (message: string, tone?: 'success' | 'danger') => void }) {
  const [heading, setHeading] = useState('I turn media spend into meaningful growth.')
  const [savedHeading, setSavedHeading] = useState(heading)
  const [selected, setSelected] = useState('Hero')
  const [device, setDevice] = useState<'desktop'|'mobile'>('desktop')
  const [isPending, startTransition] = useTransition()
  const persist = (publish: boolean) => startTransition(async () => {
    const result = await saveHomepageHero(heading, publish)
    if (result.ok) {
      setSavedHeading(heading)
      toast(result.message)
      if (publish) setScreen('Live Website Preview')
    } else toast(result.message, 'danger')
  })
  return <div className="flex min-h-[calc(100vh-80px)] flex-col">
    <PageHeading eyebrow="Visual editor" title="Homepage" description="Arrange sections, edit content and preview every breakpoint." actions={<div className="flex rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">{(['desktop','mobile'] as const).map((item) => <button key={item} onClick={() => setDevice(item)} className={`rounded-lg p-2 ${device === item ? 'bg-[var(--ink)] text-white' : 'text-[var(--muted)]'}`}><Icon name={item} size={16}/></button>)}</div>}/>
    <div className="vv-editor-grid">
      <section className="vv-card min-h-0 overflow-hidden"><div className="border-b border-[var(--line)] p-4"><div className="text-sm font-semibold">Page sections</div><div className="text-[11px] text-[var(--muted)]">Drag to reorder</div></div><div className="max-h-[630px] overflow-y-auto p-2">{homepageSections.map((item,index) => <button key={item} onClick={() => setSelected(item)} className={`vv-section-row ${selected === item ? 'is-active' : ''}`}><span className="text-[10px] text-[var(--muted)]">⠿</span><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--surface-2)] text-[10px] font-bold">{String(index + 1).padStart(2,'0')}</span><span className="min-w-0 flex-1 truncate text-left text-xs font-medium">{item}</span><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"/></button>)}</div><div className="border-t border-[var(--line)] p-3"><Button variant="secondary" icon="plus" onClick={() => setScreen('Section Manager')}>Add section</Button></div></section>
      <section className="vv-preview-stage">
        <div className={`${device === 'mobile' ? 'max-w-[390px]' : 'max-w-[900px]'} vv-browser`}>
          <div className="flex h-9 items-center gap-1.5 border-b border-[var(--line)] px-3"><span className="h-2 w-2 rounded-full bg-[#ff6b66]"/><span className="h-2 w-2 rounded-full bg-[#ffc857]"/><span className="h-2 w-2 rounded-full bg-[#4cc38a]"/><div className="mx-auto rounded-md bg-[var(--surface-2)] px-14 py-1 text-[9px] text-[var(--muted)]">vedantverse.com</div></div>
          <div className="min-h-[520px] overflow-hidden bg-[#f7f1e8]">
            <div className="flex items-center justify-between px-7 py-5 text-[10px] font-bold tracking-[.12em]"><span>VEDANTVERSE</span><span className="text-[var(--accent)]">LET&apos;S TALK ↗</span></div>
            <div className="px-7 pb-16 pt-14"><div className="mb-5 inline-flex rounded-full border border-[#ded6ca] px-3 py-1 text-[9px]">PERFORMANCE MARKETING · INDIA</div><div className={`${device === 'mobile' ? 'text-4xl' : 'text-6xl'} max-w-3xl font-semibold leading-[.98] tracking-[-.055em]`}>{heading}</div><div className="mt-6 max-w-lg text-xs leading-5 text-[#77736d]">Strategic thinking, sharp creative and media that performs. Built for brands ready to move forward.</div><div className="mt-8 flex gap-2"><span className="rounded-full bg-[#ed463b] px-4 py-2 text-[10px] font-bold text-white">EXPLORE WORK</span><span className="rounded-full border border-[#ded6ca] px-4 py-2 text-[10px] font-bold">ABOUT ME</span></div></div>
            <div className="border-y border-[#e6e0d7] py-3 text-center text-[9px] tracking-[.18em] text-[#77736d]">NIKE INDIA · RAZORPAY · CULT.FIT · THE WHOLE TRUTH · CRED</div>
          </div>
        </div>
      </section>
      <section className="vv-card h-fit overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] p-4"><div><div className="text-sm font-semibold">{selected}</div><div className="text-[11px] text-[var(--muted)]">Section settings</div></div><Badge tone="success">Visible</Badge></div><div className="grid gap-5 p-4">{selected === 'Hero' ? <><Field label="Hero heading" value={heading} onChange={setHeading} helper={`${heading.length}/120 characters`}/><Field label="Eyebrow" value="Performance Marketing · India"/><div><div className="mb-2 text-sm font-medium">Alignment</div><div className="grid grid-cols-3 gap-2">{['Left','Center','Right'].map((item) => <button key={item} className={`rounded-lg border p-2 text-xs ${item === 'Left' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--line)]'}`}>{item}</button>)}</div></div></> : <div className="rounded-xl bg-[var(--surface-2)] p-4 text-xs leading-5 text-[var(--muted)]">Select Hero to edit the primary heading. Every section supports content, images, typography, background, spacing, animation and responsive visibility.</div>}<div className="border-t border-[var(--line)] pt-4"><div className="mb-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">Design</div>{['Background & color','Spacing & layout','Typography','Animation','Responsive visibility'].map((item) => <button className="flex w-full items-center justify-between border-b border-[var(--line)] py-3 text-xs last:border-0" key={item}><span>{item}</span><Icon name="chevron" size={14}/></button>)}</div><div className="grid grid-cols-2 gap-2"><Button variant="secondary" icon="copy">Duplicate</Button><Button variant="danger" icon="trash">Delete</Button></div></div></section>
    </div>
    <PublishingBar dirty={heading !== savedHeading} saving={isPending} onSave={() => persist(false)} onPreview={() => setScreen('Live Website Preview')} onPublish={() => openPublish(() => persist(true))}/>
  </div>
}

function ContentManager({ type, setScreen }: { type: 'Blog Manager'|'Case Studies'; setScreen: (screen: Screen) => void }) {
  const isBlog = type === 'Blog Manager'
  return <>
    <PageHeading eyebrow="Content" title={type} description={isBlog ? 'Create, schedule and optimize editorial content.' : 'Build rich campaign stories from verified performance data.'} actions={<><Button variant="secondary" icon="filter">Filters</Button><Button icon="plus" onClick={() => setScreen(isBlog ? 'Blog Editor' : 'Case Study Editor')}>{isBlog ? 'New post' : 'Add case study'}</Button></>}/>
    <div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="vv-search flex flex-1"><Icon name="search" size={16}/><span>Search {isBlog ? 'posts' : 'case studies'}…</span></div><div className="flex gap-2"><Badge>All statuses</Badge><Badge>Last updated</Badge></div></div>
    <div className="vv-card overflow-hidden"><div className="vv-table-head"><span>Title</span><span className="hidden md:block">Category</span><span>Status</span><span className="hidden lg:block">Updated</span><span/></div>{contentRows[type].map(([title,category,status,date],index) => <button key={title} className="vv-table-row" onClick={() => setScreen(isBlog ? 'Blog Editor' : 'Case Study Editor')}><span className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--muted)]"><Icon name={isBlog ? 'book' : 'image'} size={16}/></span><span className="min-w-0 text-left"><span className="block truncate text-sm font-semibold">{title}</span><span className="text-[11px] text-[var(--muted)]">/{isBlog ? 'journal' : 'work'}/{title.toLowerCase().replaceAll(' ','-').slice(0,28)}</span></span></span><span className="hidden text-xs text-[var(--muted)] md:block">{category}</span><span><Badge tone={status === 'Published' ? 'success' : status === 'Draft' ? 'warning' : 'accent'}>{status}</Badge></span><span className="hidden text-xs text-[var(--muted)] lg:block">{date}</span><span className="justify-self-end"><Icon name="more" size={16}/></span></button>)}</div>
  </>
}

function ArticleEditor({ kind, setScreen, openPublish }: { kind: 'blog'|'case'; setScreen: (s: Screen) => void; openPublish: (action: () => void) => void }) {
  const [title,setTitle] = useState(kind === 'blog' ? 'The Modern Performance Marketing Playbook' : 'Always On Performance: Nike India')
  const [saved,setSaved] = useState(title)
  const tabs = kind === 'blog' ? ['Content','SEO & AEO','Social preview','Settings'] : ['Overview','Campaign story','Metrics','Page builder']
  const [tab,setTab] = useState(tabs[0])
  return <>
    <PageHeading eyebrow={kind === 'blog' ? 'Blog editor' : 'Case study editor'} title={kind === 'blog' ? 'Edit post' : 'Edit case study'} description="Draft autosave is on. Only verified data is published." actions={<Badge tone="warning">Draft</Badge>}/>
    <div className="vv-tabs">{tabs.map((item) => <button key={item} onClick={() => { setTab(item); if (item.includes('SEO')) setScreen('SEO Editor'); if (item === 'Page builder') setScreen('Case Study Block Builder') }} className={tab === item ? 'is-active' : ''}>{item}</button>)}</div>
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="vv-card p-6"><div className="grid gap-5"><Field label={kind === 'blog' ? 'Blog title' : 'Campaign name'} value={title} onChange={setTitle}/><Field label="Slug" value={title.toLowerCase().replaceAll(' ','-').replaceAll(':','')}/><label className="grid gap-2 text-sm font-medium">Introduction<textarea className="vv-input min-h-36 resize-y" defaultValue={kind === 'blog' ? 'A practical framework for building sustainable growth across creative, media and measurement.' : 'How a connected full-funnel media strategy improved quality and efficiency.'}/></label><div><div className="mb-2 text-sm font-medium">{kind === 'blog' ? 'Article blocks' : 'Campaign story'}</div><div className="grid gap-2">{['Opening context','Strategic framework','Creative showcase','Key learnings'].map((item,index) => <div className="vv-block-row" key={item}><span className="text-[var(--muted)]">⠿</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--surface-2)] text-xs">{index + 1}</span><span className="flex-1 text-sm font-medium">{item}</span><Icon name="more" size={16}/></div>)}</div><Button variant="secondary" icon="plus">Add content block</Button></div></div></section>
      <aside className="grid h-fit gap-4"><section className="vv-card p-5"><div className="mb-4 text-sm font-semibold">Publishing</div><div className="grid gap-3 text-xs">{[['Status','Draft'],['Visibility','Public'],['Author','Vedant Sharma'],['Publish date','Immediately']].map(([a,b]) => <div className="flex justify-between border-b border-[var(--line)] pb-3 last:border-0 last:pb-0" key={a}><span className="text-[var(--muted)]">{a}</span><span className="font-medium">{b}</span></div>)}</div></section><section className="vv-card p-5"><div className="mb-3 text-sm font-semibold">Featured image</div><button onClick={() => setScreen('Media Library')} className="grid aspect-[16/9] w-full place-items-center rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--muted)]"><span className="grid justify-items-center gap-2 text-xs"><Icon name="upload"/><span>Choose or upload</span></span></button></section></aside>
    </div>
    <PublishingBar dirty={title !== saved} saving={false} onSave={() => setSaved(title)} onPreview={() => setScreen('Live Website Preview')} onPublish={() => openPublish(() => setSaved(title))}/>
  </>
}

function MediaLibrary({ setScreen }: { setScreen: (s: Screen) => void }) {
  const colors = ['from-[#ca735b] to-[#792f2a]','from-[#8ba8b3] to-[#39515e]','from-[#d6a95f] to-[#7c542a]','from-[#6f9b7a] to-[#294d36]','from-[#b8a2c4] to-[#594763]','from-[#cbbba4] to-[#786957]']
  return <>
    <PageHeading eyebrow="Assets" title="Media library" description="Original files are preserved. Crops are stored independently for every placement." actions={<Button icon="upload">Upload media</Button>}/>
    <div className="mb-5 flex gap-3"><div className="vv-search flex flex-1"><Icon name="search" size={16}/><span>Search 128 assets…</span></div><Button variant="secondary" icon="filter">All media</Button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{colors.map((color,index) => <button key={color} className="vv-media-card text-left" onClick={() => setScreen('Image Crop Editor')}><div className={`aspect-[4/3] bg-gradient-to-br ${color} p-5`}><div className="h-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm"/></div><div className="p-3"><div className="truncate text-sm font-semibold">{['nike-performance-hero.jpg','campaign-dashboard.png','growth-playbook-cover.jpg','cultfit-motion.jpg','razorpay-brand.png','studio-portrait.jpg'][index]}</div><div className="mt-1 flex justify-between text-[10px] text-[var(--muted)]"><span>{index % 2 ? '2400 × 1600' : '3200 × 2133'}</span><span>{(1.8 + index * .4).toFixed(1)} MB</span></div></div></button>)}</div>
  </>
}

function CropEditor({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [ratio,setRatio] = useState('16:9')
  const [zoom,setZoom] = useState(42)
  return <>
    <PageHeading eyebrow="Image editor" title="Crop image" description="nike-performance-hero.jpg · Original preserved" actions={<><Button variant="secondary" icon="undo">Reset</Button><Button icon="save" onClick={() => setScreen('Media Library')}>Save crop</Button></>}/>
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="vv-crop-stage"><div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-xl bg-gradient-to-br from-[#d3856b] via-[#8d453b] to-[#382329]"><div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_30%,white_0,transparent_35%)]"/><div className="absolute inset-[10%] border border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,.48)]"><div className="absolute inset-y-0 left-1/3 border-l border-white/30"/><div className="absolute inset-y-0 right-1/3 border-r border-white/30"/><div className="absolute inset-x-0 top-1/3 border-t border-white/30"/><div className="absolute inset-x-0 bottom-1/3 border-b border-white/30"/><span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-white"/><span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-white"/></div><div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-[10px] text-white backdrop-blur">Drag to reposition</div></div></section>
      <aside className="vv-card h-fit p-5"><div className="mb-5 text-sm font-semibold">Crop settings</div><div className="grid gap-5"><div><div className="mb-2 text-xs font-medium">Placement</div><select className="vv-input"><option>Homepage featured case study</option><option>Case study hero</option><option>Blog thumbnail</option><option>Social sharing image</option></select></div><div><div className="mb-2 text-xs font-medium">Aspect ratio</div><div className="grid grid-cols-4 gap-2">{['16:9','4:3','1:1','3:4','4:5','9:16','Free'].map((item) => <button key={item} onClick={() => setRatio(item)} className={`rounded-lg border px-2 py-2 text-[10px] ${ratio === item ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--line)]'}`}>{item}</button>)}</div></div><label className="grid gap-2 text-xs font-medium"><span className="flex justify-between"><span>Zoom</span><span className="text-[var(--muted)]">{zoom}%</span></span><input type="range" min="0" max="100" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="accent-[var(--accent)]"/></label><div className="grid grid-cols-2 gap-2"><Button variant="secondary" icon="rotate">Rotate</Button><Button variant="secondary" icon="crop">Free crop</Button></div><div className="rounded-xl bg-[var(--surface-2)] p-4"><div className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">Live preview</div><div className="aspect-video rounded-lg bg-gradient-to-br from-[#d3856b] to-[#382329]"/></div></div></aside>
    </div>
  </>
}

function SeoDashboard() {
  const checks = [['Missing meta descriptions','3','warning'],['Missing image alt text','7','warning'],['Duplicate page titles','0','success'],['Broken links','2','danger'],['Missing schema','4','warning'],['Indexable pages','38','success']]
  return <>
    <PageHeading eyebrow="Discoverability" title="SEO & AEO control centre" description="Technical, social and answer-engine readiness in one place." actions={<Button variant="secondary" icon="search">Run audit</Button>}/>
    <div className="mb-5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3 text-xs text-[var(--muted)]"><strong className="text-[var(--ink)]">Important:</strong> Health checks are workspace diagnostics, not simulated search rankings.</div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{checks.map(([label,value,tone]) => <div className="vv-card p-5" key={label}><div className="flex items-start justify-between"><div className="text-sm font-medium">{label}</div><Badge tone={tone as 'success'|'warning'|'danger'}>{tone === 'success' ? 'Good' : 'Review'}</Badge></div><div className="mt-6 text-4xl font-semibold">{value}</div><div className="mt-2 flex items-center gap-1 text-xs text-[var(--accent)]">View affected items <Icon name="arrow" size={13}/></div></div>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="vv-card p-5"><div className="vv-h2">Search appearance</div><div className="mt-5 rounded-xl border border-[var(--line)] p-4"><div className="text-xs text-[#1670c5]">vedantverse.com › performance-marketing</div><div className="mt-1 text-lg text-[#2b4fa2]">Performance Marketing Strategist — VedantVerse</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">Strategy, creative and media systems designed to turn investment into sustainable growth.</div></div></section><section className="vv-card p-5"><div className="vv-h2">AI search readiness</div><div className="mt-4 grid gap-3">{['Direct-answer summaries','Question-led sections','Entity references','Author credentials','Structured FAQ answers'].map((item,index) => <div className="flex items-center gap-3" key={item}><span className={`grid h-7 w-7 place-items-center rounded-full ${index < 3 ? 'bg-[var(--success-soft)] text-[var(--success)]' : 'bg-[var(--warning-soft)] text-[var(--warning)]'}`}><Icon name={index < 3 ? 'check' : 'clock'} size={13}/></span><span className="flex-1 text-xs font-medium">{item}</span><span className="text-[10px] text-[var(--muted)]">{index < 3 ? 'Ready' : 'Improve'}</span></div>)}</div></section></div>
  </>
}

function ClientDirectory({ setScreen }: { setScreen: (s: Screen) => void }) {
  const clients = [['NIKE','Sportswear','Meta · Google','Featured'],['cult.fit','Health & fitness','Meta · YouTube','Visible'],['Razorpay','Fintech','Google · LinkedIn','Visible'],['CRED','Fintech','Meta · Google','Hidden'],['TWT','FMCG','Meta · Google','Featured'],['TATA 1mg','Health','Google · YouTube','Visible']]
  return <>
    <PageHeading eyebrow="Shared source of truth" title="Client directory" description="Logos, relationships and marquee visibility stay synchronized." actions={<Button icon="plus">Add client</Button>}/>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{clients.map(([name,industry,platforms,status]) => <button key={name} onClick={() => setScreen('Client Logo Manager')} className="vv-card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"><div className="mb-8 flex items-start justify-between"><div className="grid h-12 min-w-20 place-items-center rounded-lg bg-[var(--surface-2)] px-3 text-sm font-extrabold tracking-tight">{name}</div><Badge tone={status === 'Hidden' ? 'neutral' : status === 'Featured' ? 'accent' : 'success'}>{status}</Badge></div><div className="text-sm font-semibold">{name}</div><div className="mt-1 text-xs text-[var(--muted)]">{industry} · {platforms}</div><div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-[11px] text-[var(--muted)]"><span>2 related case studies</span><Icon name="arrow" size={14}/></div></button>)}</div>
  </>
}

function UserManagement() {
  const [invite,setInvite] = useState(false)
  return <>
    <PageHeading eyebrow="Access control" title="User management" description="Invite collaborators and keep every permission intentional." actions={<Button icon="plus" onClick={() => setInvite(true)}>Invite user</Button>}/>
    <div className="vv-card overflow-hidden">{[['Vedant Sharma','vedant@vedantverse.com','Owner','Active'],['Priya Shah','priya@studio.co','Editor','Active'],['Arjun Mehta','arjun@studio.co','Blog contributor','Invited'],['Maya Rao','maya@agency.co','Viewer','Active']].map(([name,email,role,status]) => <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[var(--line)] p-4 last:border-0 md:grid-cols-[1fr_180px_110px_30px]" key={email}><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">{name.split(' ').map(v=>v[0]).join('')}</div><div><div className="text-sm font-semibold">{name}</div><div className="text-[11px] text-[var(--muted)]">{email}</div></div></div><div className="hidden text-xs md:block">{role}</div><Badge tone={status === 'Active' ? 'success' : 'warning'}>{status}</Badge><Icon name="more" size={15}/></div>)}</div>
    {invite && <Modal title="Invite contributor" onClose={() => setInvite(false)}><div className="grid gap-4"><Field label="Email address" value="contributor@example.com"/><div><div className="mb-2 text-sm font-medium">Assigned role</div><select className="vv-input"><option>Blog contributor</option><option>Editor</option><option>Viewer</option></select></div><div className="rounded-xl bg-[var(--surface-2)] p-4 text-xs leading-5 text-[var(--muted)]"><strong className="text-[var(--ink)]">Blog contributor</strong><br/>Can create and edit assigned blog posts. Cannot publish, access site settings, or manage users.</div><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setInvite(false)}>Cancel</Button><Button onClick={() => setInvite(false)}>Send invitation</Button></div></div></Modal>}
  </>
}

function VersionHistory({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [compare,setCompare] = useState(false)
  return <>
    <PageHeading eyebrow="Safety & recovery" title="Version history" description="Review, compare and restore every meaningful content change."/>
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]"><section className="vv-card overflow-hidden">{[['Homepage · Hero heading','Vedant Sharma','Today, 09:42','Published'],['Homepage · Hero image','Vedant Sharma','Yesterday, 18:14','Draft'],['Homepage · Services','Priya Shah','20 May, 12:08','Published'],['Homepage · Featured work','Vedant Sharma','18 May, 16:32','Published']].map(([title,user,date,status],index) => <div className="flex gap-4 border-b border-[var(--line)] p-5 last:border-0" key={date}><div className="relative"><span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-2)] text-xs font-bold">{index+1}</span>{index < 3 && <span className="absolute left-1/2 top-9 h-8 border-l border-[var(--line)]"/>}</div><div className="flex-1"><div className="flex items-center justify-between gap-3"><div className="text-sm font-semibold">{title}</div><Badge tone={status === 'Draft' ? 'warning' : 'success'}>{status}</Badge></div><div className="mt-1 text-[11px] text-[var(--muted)]">{user} · {date}</div><div className="mt-3 flex gap-2"><Button variant="ghost" icon="eye">View</Button><Button variant="ghost" onClick={() => setCompare(true)}>Compare</Button></div></div></div>)}</section><aside className="vv-card h-fit p-5"><div className="vv-h2">Restore safely</div><div className="mt-2 text-xs leading-5 text-[var(--muted)]">Restoring creates a new draft. The current published version remains live until you explicitly publish the restored content.</div><div className="mt-5 rounded-xl bg-[var(--success-soft)] p-4 text-xs text-[var(--success)]"><div className="mb-1 font-bold">Content loss protection</div>Autosave, drafts and 50 previous versions are enabled.</div></aside></div>
    {compare && <Modal title="Compare versions" onClose={() => setCompare(false)}><div className="grid gap-4"><div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-[var(--danger-soft)] p-4 text-sm"><div className="mb-2 text-[10px] font-bold uppercase text-[var(--danger)]">Previous</div>I build campaigns that perform.</div><div className="rounded-xl bg-[var(--success-soft)] p-4 text-sm"><div className="mb-2 text-[10px] font-bold uppercase text-[var(--success)]">Current</div>I turn media spend into meaningful growth.</div></div><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setCompare(false)}>Close</Button><Button icon="undo" onClick={() => {setCompare(false); setScreen('Homepage Editor')}}>Restore as draft</Button></div></div></Modal>}
  </>
}

function GenericScreen({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const data: Partial<Record<Screen,[string,string,string[]]>> = {
    'Website Overview':['Website overview','Live portfolio health, domains and environments.',['Production website','Preview environment','Publishing queue','Connected services']],
    'Activity Log':['Activity log','A complete audit trail across content, settings and users.',['Content changes','Publishing events','User access','System events']],
    'Pages Manager':['Pages manager','Create and organize every page on your public website.',['Home','About','Work','Journal']],
    'Testimonials':['Testimonials','Manage social proof and homepage visibility.',['Aarav · Nike India','Meera · Cult.fit','Karan · Razorpay','Nisha · D2C Founder']],
    'Experience & Journey':['Experience & journey','Edit the career timeline and milestone story.',['Performance Marketing Lead','Growth Strategist','Independent Consultant','Creative Studio']],
    'Services':['Services','Package your capabilities into clear, editable offers.',['Performance strategy','Paid media management','Creative testing','Measurement & analytics']],
    'Contact Section':['Contact section','Control the contact CTA, details and linked form.',['Primary heading','Contact details','Form fields','Availability']],
    'Theme Settings':['Global theme settings','Define typography, colors, spacing and radius once.',['Color palette','Typography','Spacing scale','Corner radius']],
    'Navigation Manager':['Navigation manager','Organize desktop and mobile navigation independently.',['Work → /work','About → /about','Journal → /journal','Contact → /contact']],
    'Section Manager':['Section library','Reusable, configurable building blocks for every page.',['Hero','Text + image','Metrics grid','Case study cards']],
    'Footer Editor':['Footer editor','Manage brand details, legal links, contact and newsletter CTA.',['Brand information','Social links','Legal links','Newsletter CTA']],
    'Animation Controls':['Animation controls','Create restrained motion with accessibility controls.',['Page transitions','Reveal on scroll','Marquee motion','Reduced motion']],
    'Responsive Settings':['Responsive layout settings','Tune visibility, spacing and composition per breakpoint.',['Desktop · 1440','Tablet · 1024','Mobile · 390','Custom visibility']],
    'Form Submissions':['Form submissions','Private lead records from every connected website form.',['New consultation · Ananya Rao','Contact enquiry · Rohan Mehta','Newsletter · Mira Kapoor','Contact enquiry · Jay Singh']],
    'Popup Manager':['Popup manager','Design and schedule conversion prompts without code.',['First display · 5 seconds','Second display · 27 seconds','Third display · 5 minutes','Exit intent · Enabled']],
    'Roles & Permissions':['Roles & permissions','Clear boundaries for every content contributor.',['Owner · Full access','Admin · Content and publishing','Editor · Blogs and case studies','Blog contributor · Assigned posts only']],
    'System Settings':['System settings','Publishing, integrations, backups and security.',['Publishing settings','Website integrations','Backup & restore','Security']],
    'Client Logo Manager':['Client logo manager','Replace the original logo and control every website placement.',['Original logo','Marquee visibility','Logo wall visibility','Related case studies']],
    'Case Study Block Builder':['Case study block builder','Compose a narrative from reusable, independently configurable blocks.',['Hero banner','Campaign overview','Performance metrics','Creative showcase']],
    'SEO Editor':['SEO editor','Shape search, social and answer-engine appearance.',['Meta title & description','Open Graph','Schema markup','Direct-answer summary']],
  }
  const current = data[screen] ?? [screen,'A focused workspace for this part of VedantVerse.',['Overview','Configuration','Visibility','Publishing']]
  return <>
    <PageHeading eyebrow="VedantVerse CMS" title={current[0]} description={current[1]} actions={<><Button variant="secondary" icon="eye" onClick={() => setScreen('Live Website Preview')}>Preview</Button><Button icon="save">Save changes</Button></>}/>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{current[2].map((item,index) => <button className="vv-card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]" key={item}><span className="mb-8 grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon name={['settings','layers','eye','publish'][index % 4] as IconName}/></span><span className="block text-sm font-semibold">{item}</span><span className="mt-1 block text-xs text-[var(--muted)]">Open settings and manage content</span><span className="mt-5 flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">Configure <Icon name="arrow" size={13}/></span></button>)}</div>
  </>
}

function LivePreview({ setScreen }: { setScreen: (s: Screen) => void }) {
  return <div className="-m-4 md:-m-7"><div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] p-3"><div className="flex items-center gap-2"><Button variant="ghost" onClick={() => setScreen('Homepage Editor')}>Back to editor</Button><Badge tone="warning">Draft preview</Badge></div><div className="hidden gap-1 sm:flex"><button className="vv-icon-button bg-[var(--ink)] text-white"><Icon name="desktop"/></button><button className="vv-icon-button"><Icon name="devices"/></button><button className="vv-icon-button"><Icon name="mobile"/></button></div><Button variant="secondary" icon="globe">Published version</Button></div><div className="min-h-[calc(100vh-133px)] bg-[#f7f1e8] p-5 text-[#191919] md:p-10"><div className="mx-auto max-w-6xl"><div className="flex items-center justify-between text-xs font-extrabold tracking-[.15em]"><span>VEDANTVERSE</span><div className="flex gap-6"><span>WORK</span><span>ABOUT</span><span>JOURNAL</span><span className="text-[#ed463b]">LET&apos;S TALK ↗</span></div></div><div className="py-24"><div className="mb-6 inline-flex rounded-full border border-[#ded6ca] px-4 py-2 text-[10px]">PERFORMANCE MARKETING · INDIA</div><div className="max-w-5xl text-6xl font-semibold leading-[.94] tracking-[-.06em] md:text-8xl">I turn media spend into <span className="text-[#ed463b]">meaningful growth.</span></div><div className="mt-8 max-w-xl text-sm leading-6 text-[#77736d]">Strategic thinking, sharp creative and media systems that perform. Built for ambitious brands ready to move forward.</div></div><div className="grid gap-4 border-t border-[#ded6ca] pt-6 md:grid-cols-3">{['£12M+ media managed','4.8× average ROAS','18 brands scaled'].map((item) => <div className="text-sm font-semibold" key={item}>{item}</div>)}</div></div></div></div>
}

function Login() {
  return <div className="grid min-h-[calc(100vh-130px)] place-items-center"><div className="vv-card w-full max-w-md p-7"><div className="mb-7 grid h-11 w-11 place-items-center rounded-xl bg-[var(--ink)] font-bold text-white">V</div><div className="vv-h1">Welcome back.</div><div className="mt-2 text-sm text-[var(--muted)]">Sign in securely through the Payload Admin workspace.</div><div className="mt-7 grid gap-4"><Field label="Email address" value="vedant@vedantverse.com"/><Field label="Password" value="••••••••••"/><a href="/admin" className="vv-button vv-button--primary justify-center">Continue to secure admin <Icon name="arrow" size={16}/></a></div><div className="mt-5 flex items-center gap-2 text-[11px] text-[var(--muted)]"><Icon name="lock" size={13}/>Protected by authenticated, role-based access.</div></div></div>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="vv-modal-backdrop"><div className="vv-modal"><div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4"><div className="text-base font-semibold">{title}</div><button className="vv-icon-button" onClick={onClose}><Icon name="close"/></button></div><div className="p-5">{children}</div></div></div>
}

export default function CommandCentre() {
  const [screen,setScreen] = useState<Screen>('Dashboard')
  const [collapsed,setCollapsed] = useState(false)
  const [dark,setDark] = useState(false)
  const [publishAction,setPublishAction] = useState<null | (() => void)>(null)
  const [toastState,setToastState] = useState<{message:string;tone:'success'|'danger'} | null>(null)
  const toast = (message: string, tone: 'success'|'danger' = 'success') => {
    setToastState({message,tone})
    window.setTimeout(() => setToastState(null), 4000)
  }
  const openPublish = (action: () => void) => setPublishAction(() => action)
  const content = useMemo(() => {
    if (screen === 'Dashboard') return <Dashboard setScreen={setScreen}/>
    if (screen === 'Homepage Editor') return <HomepageEditor setScreen={setScreen} openPublish={openPublish} toast={toast}/>
    if (screen === 'Blog Manager' || screen === 'Case Studies') return <ContentManager type={screen} setScreen={setScreen}/>
    if (screen === 'Blog Editor') return <ArticleEditor kind="blog" setScreen={setScreen} openPublish={openPublish}/>
    if (screen === 'Case Study Editor') return <ArticleEditor kind="case" setScreen={setScreen} openPublish={openPublish}/>
    if (screen === 'Media Library') return <MediaLibrary setScreen={setScreen}/>
    if (screen === 'Image Crop Editor') return <CropEditor setScreen={setScreen}/>
    if (screen === 'SEO & AEO Dashboard') return <SeoDashboard/>
    if (screen === 'Client Directory') return <ClientDirectory setScreen={setScreen}/>
    if (screen === 'User Management') return <UserManagement/>
    if (screen === 'Version History') return <VersionHistory setScreen={setScreen}/>
    if (screen === 'Live Website Preview') return <LivePreview setScreen={setScreen}/>
    if (screen === 'Admin Login') return <Login/>
    return <GenericScreen screen={screen} setScreen={setScreen}/>
  }, [screen])
  return <div className={dark ? 'dark' : ''}>
    <div className="vv-app">
      <Sidebar screen={screen} setScreen={setScreen} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="min-w-0 flex-1"><Header screen={screen} setScreen={setScreen} toggleTheme={() => setDark(!dark)}/><main className="vv-main">{content}</main></div>
      {publishAction && <Modal title="Publish changes?" onClose={() => setPublishAction(null)}><div className="grid gap-5"><div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><Icon name="publish"/></div><div><div className="text-sm font-semibold">Update the live website</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">The current draft will become the published version. A new version-history entry will be created.</div></div><div className="rounded-xl bg-[var(--surface-2)] p-4 text-xs"><div className="flex justify-between"><span className="text-[var(--muted)]">Environment</span><span className="font-semibold">Production</span></div><div className="mt-2 flex justify-between"><span className="text-[var(--muted)]">Validation</span><span className="text-[var(--success)]">Ready to publish</span></div></div><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setPublishAction(null)}>Cancel</Button><Button icon="publish" onClick={() => { const action = publishAction; setPublishAction(null); action() }}>Publish now</Button></div></div></Modal>}
      {toastState && <div className={`vv-toast ${toastState.tone === 'danger' ? 'is-danger' : ''}`}><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"><Icon name={toastState.tone === 'danger' ? 'close' : 'check'} size={14}/></span><div><div className="text-xs font-semibold">{toastState.tone === 'danger' ? 'Action failed' : 'Confirmed by server'}</div><div className="text-[11px] text-[var(--muted)]">{toastState.message}</div></div></div>}
    </div>
  </div>
}
