import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  items?: NavItem[];
  badge?: string;
  requiresRole?: string; // Optional role requirement
}

interface NavGroupProps {
  label: string;
  items: NavItem[];
  requiresRole?: string; // Optional role requirement for entire group
}

export function NavGroup({ label, items, requiresRole }: NavGroupProps) {
  const page = usePage<SharedData>();
  const { auth } = page.props;

  // Check if user has required role (if specified)
  if (requiresRole) {
    const hasRole =
      auth.user?.roles &&
      Array.isArray(auth.user.roles) &&
      auth.user.roles.some(role => role.name === requiresRole);

    if (!hasRole) {
      return null;
    }
  }

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          // Check individual item role requirement
          if (item.requiresRole) {
            const hasRole =
              auth.user?.roles &&
              Array.isArray(auth.user.roles) &&
              auth.user.roles.some(role => role.name === item.requiresRole);

            if (!hasRole) {
              return null;
            }
          }

          const isActive = page.url.startsWith(resolveUrl(item.href));

          // Check if any sub-item is active
          const hasActiveSubItem =
            item.items && item.items.some(subItem => page.url.startsWith(resolveUrl(subItem.href)));

          // Collapsible menu with sub-items
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={hasActiveSubItem}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map(subItem => {
                        // Check sub-item role requirement
                        if (subItem.requiresRole) {
                          const hasRole =
                            auth.user?.roles &&
                            Array.isArray(auth.user.roles) &&
                            auth.user.roles.some(role => role.name === subItem.requiresRole);

                          if (!hasRole) {
                            return null;
                          }
                        }

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={page.url.startsWith(resolveUrl(subItem.href))}
                            >
                              <Link href={subItem.href} prefetch>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Single menu item
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
