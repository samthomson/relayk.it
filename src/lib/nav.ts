import { getCollection, type CollectionEntry } from 'astro:content';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

type Feature = CollectionEntry<'features'>;
type Service = CollectionEntry<'services'>;
type App = CollectionEntry<'apps'>;
type Page = CollectionEntry<'pages'>;

const byOrder = <T extends { data: { order: number } }>(a: T, b: T): number => a.data.order - b.data.order;

/**
 * The docs sidebar / mobile drawer tree. Sections are assembled from the
 * content collections so adding a page file adds it to the nav. Reference
 * pages (troubleshooting, changelog) are appended to the Docs section.
 */
export async function getNav(): Promise<NavSection[]> {
  const [pages, features, services, apps] = await Promise.all([
    getCollection('pages'),
    getCollection('features'),
    getCollection('services'),
    getCollection('apps'),
  ]);

  const startPages: Page[] = pages.filter((p) => p.data.section === 'start').sort(byOrder);
  const referencePages: Page[] = pages.filter((p) => p.data.section === 'reference').sort(byOrder);

  return [
    {
      label: 'Docs',
      items: [
        ...startPages.map((p) => ({ label: p.data.title, href: `/${p.id}` })),
        { label: 'Install', href: '/install' },
        ...referencePages.map((p) => ({ label: p.data.title, href: `/${p.id}` })),
      ],
    },
    {
      label: 'Features',
      items: features.sort(byOrder).map((f: Feature) => ({ label: f.data.title, href: `/features/${f.id}` })),
    },
    {
      label: 'Services',
      items: [
        { label: 'All services', href: '/services' },
        ...services.sort(byOrder).map((s: Service) => ({ label: s.data.title, href: `/services/${s.id}` })),
      ],
    },
    {
      label: 'Apps',
      items: apps.sort(byOrder).map((a: App) => ({ label: a.data.title, href: `/apps/${a.id}` })),
    },
  ].filter((section) => section.items.length > 0);
}

/** Flattened tree for prev/next page navigation. */
export function flattenNav(sections: readonly NavSection[]): NavItem[] {
  return sections.flatMap((section) => section.items);
}

export function pagerFor(items: readonly NavItem[], currentPath: string): { prev?: NavItem; next?: NavItem } {
  const normalize = (href: string) => (href.endsWith('/') && href !== '/' ? href.slice(0, -1) : href);
  const index = items.findIndex((item) => normalize(item.href) === normalize(currentPath));
  if (index === -1) return {};
  return {
    prev: index > 0 ? items[index - 1] : undefined,
    next: index < items.length - 1 ? items[index + 1] : undefined,
  };
}
