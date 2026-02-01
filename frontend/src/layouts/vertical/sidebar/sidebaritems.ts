export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  isPro?: boolean;
  roles?: string[];
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  isPro?: boolean;
  roles?: string[];
}

import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
  {
    id: 0,
    heading: 'Home',
    children: [
      {
        id: uniqueId() + 1,
        name: 'IP List',
        icon: 'solar:laptop-2-linear',
        url: '/',
        roles: ['admin', 'user']
      },
      {
        id: uniqueId() + 2,
        name: 'User',
        icon: 'solar:users-group-two-rounded-line-duotone',
        url: '/users',
        roles: ['admin']
      },
      {
        id: uniqueId() + 3,
        name: 'Audit Logs',
        icon: 'solar:notes-minimalistic-outline',
        url: '/audit-logs',
        roles: ['admin']
      },
    ],
  }
];

export default SidebarContent;
