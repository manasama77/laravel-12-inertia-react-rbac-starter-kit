import { NavFooter } from '@/components/nav-footer';
import { NavGroup, type NavItem } from '@/components/nav-group';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import RoutePermission from '@/routes/permissions';
import RouteRole from '@/routes/roles';
import RouteUser from '@/routes/users';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings, Shield, ShieldCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

// Main navigation items
const platformNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
    icon: LayoutGrid,
  },
  // Example: Add more single menu items here
  // {
  //   title: 'Reports',
  //   href: '/reports',
  //   icon: FileText,
  //   badge: '3', // Optional badge
  // },
];

// Settings navigation items (requires Super Admin role)
const settingsNavItems: NavItem[] = [
  {
    title: 'Managements',
    href: '#',
    icon: Settings,
    items: [
      {
        title: 'Users Management',
        href: RouteUser.index.url(),
        icon: Users,
      },
      {
        title: 'Roles Management',
        href: RouteRole.index.url(),
        icon: Shield,
      },
      {
        title: 'Permissions Management',
        href: RoutePermission.index.url(),
        icon: ShieldCheck,
      },
    ],
  },
  // Example: Add more collapsible groups or single items
  // {
  //   title: 'Configuration',
  //   href: '/settings/config',
  //   icon: Cog,
  //   requiresRole: 'Super Admin', // Optional: role requirement for individual items
  // },
];

const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Platform" items={platformNavItems} />
        <NavGroup label="Settings" items={settingsNavItems} requiresRole="Super Admin" />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
