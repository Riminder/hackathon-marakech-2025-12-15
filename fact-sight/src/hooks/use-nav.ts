'use client';

/**
 * Hook to return navigation items without filtering
 * All navigation items are now public and accessible
 */

import type { NavItem } from '@/types';

/**
 * Hook to return navigation items
 *
 * @param items - Array of navigation items
 * @returns All items (no filtering)
 */
export function useFilteredNavItems(items: NavItem[]) {
  return items;
}
