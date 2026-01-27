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
}

import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
  {
    heading: 'Home',
    children: [
      {
        name: 'IP List',
        icon: 'solar:laptop-2-linear',
        id: uniqueId(),
        url: '/'
      },
            {
        name: 'User',
        icon: 'solar:users-group-two-rounded-line-duotone',
        id: uniqueId(),
        url: '/test'
      },
            {
        name: 'Audit Logs',
        icon: 'solar:notes-minimalistic-outline',
        id: uniqueId(),
        url: '/audit-logs'
      },
    ],
  }
];

export default SidebarContent;
