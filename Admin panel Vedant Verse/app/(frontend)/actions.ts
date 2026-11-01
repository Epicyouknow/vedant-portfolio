'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

type ActionResult = {
  ok: boolean
  message: string
}

export async function saveHomepageHero(
  heading: string,
  publish = false,
): Promise<ActionResult> {
  const cleanHeading = heading.trim()
  if (cleanHeading.length < 3 || cleanHeading.length > 120) {
    return { ok: false, message: 'Hero heading must be between 3 and 120 characters.' }
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'admins') {
    return { ok: false, message: 'Open Payload Admin and sign in before saving.' }
  }

  try {
    const current = await payload.findGlobal({
      slug: 'homepage',
      draft: true,
      overrideAccess: false,
      user,
    })
    const existingSections = current.sections ?? []
    const heroIndex = existingSections.findIndex((section) => section.sectionType === 'hero')
    const hero = {
      label: 'Hero',
      sectionType: 'hero' as const,
      enabled: true,
      heading: cleanHeading,
      alignment: 'left' as const,
      spacing: 'spacious' as const,
      animation: 'fade-up' as const,
      desktopVisible: true,
      tabletVisible: true,
      mobileVisible: true,
    }
    const sections =
      heroIndex >= 0
        ? existingSections.map((section, index) =>
            index === heroIndex ? { ...section, heading: cleanHeading } : section,
          )
        : [hero, ...existingSections]

    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        sections,
        _status: publish ? 'published' : 'draft',
      },
      draft: !publish,
      overrideAccess: false,
      user,
    })

    return {
      ok: true,
      message: publish ? 'Homepage published successfully.' : 'Draft saved to Payload.',
    }
  } catch {
    return {
      ok: false,
      message: publish ? 'Publishing failed. No live content was changed.' : 'Draft could not be saved.',
    }
  }
}
