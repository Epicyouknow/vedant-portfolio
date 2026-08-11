import fs from 'fs';
import path from 'path';
import { CLIENTS_DATA } from '../data/clientsData';
import { ClientCaseStudy, mapLegacyToCaseStudy } from '../types/caseStudy';

export * from '../types/caseStudy';

const caseStudiesDirectory = path.join(process.cwd(), 'src/data/case-studies');

export function ensureCaseStudiesDirectory() {
  if (typeof window === 'undefined' && !fs.existsSync(caseStudiesDirectory)) {
    fs.mkdirSync(caseStudiesDirectory, { recursive: true });
  }
}

export function getAllCaseStudies(): ClientCaseStudy[] {
  // Exclude TravelKitSR and Daakiyawala as specified in prompt rules
  const validClients = CLIENTS_DATA.filter((c) => c.slug !== 'travelkitsr' && c.slug !== 'daakiyawala');

  if (typeof window !== 'undefined') {
    return validClients.map(mapLegacyToCaseStudy);
  }

  try {
    ensureCaseStudiesDirectory();
    if (!fs.existsSync(caseStudiesDirectory)) {
      return validClients.map(mapLegacyToCaseStudy);
    }

    const files = fs.readdirSync(caseStudiesDirectory);
    const diskStudies: ClientCaseStudy[] = [];

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(caseStudiesDirectory, file), 'utf8');
          diskStudies.push(JSON.parse(content));
        } catch (e) {
          console.error(`Error reading case study file ${file}:`, e);
        }
      }
    });

    const diskSlugMap = new Map(diskStudies.map((s) => [s.slug, s]));

    return validClients.map((client) => {
      if (diskSlugMap.has(client.slug)) {
        return diskSlugMap.get(client.slug)!;
      }
      return mapLegacyToCaseStudy(client);
    });
  } catch (e) {
    return validClients.map(mapLegacyToCaseStudy);
  }
}

export function getCaseStudyBySlug(slug: string): ClientCaseStudy | null {
  const all = getAllCaseStudies();
  return all.find((item) => item.slug === slug) || null;
}
