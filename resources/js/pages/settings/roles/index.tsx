import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

import { ButtonDeleteWithDialog } from '@/components/button-delete-with-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import RouteProfile from '@/routes/profile';
import RouteRole from '@/routes/roles';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: RouteProfile.edit.url(),
  },
  {
    title: 'Managements',
    href: '#',
  },
  {
    title: 'Roles',
    href: RouteRole.index.url(),
  },
];

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  created_at: string;
}

interface PaginatedRoles {
  data: Role[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function RolesIndex({ roles }: { roles: PaginatedRoles }) {
  const handleDelete = (id: number) => {
    router.delete(RouteRole.destroy.url(id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-4 py-2">
        <Head title="Roles Management" />

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Roles Management</h1>
              <p className="text-muted-foreground">Manage roles and their permissions</p>
            </div>
            <Link href={RouteRole.create.url()} className="mt-4 ml-auto md:mt-0">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>A list of all roles in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.data.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map(permission => (
                            <Badge key={permission.id} variant="secondary">
                              {permission.name}
                            </Badge>
                          ))}
                          {role.permissions.length === 0 && (
                            <span className="text-sm text-muted-foreground">No permissions</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/settings/roles/${role.id}/edit`}>
                            <Button
                              variant={'default'}
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-500/70 hover:text-white"
                              disabled={role.permissions.length === 0}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>

                          <ButtonDeleteWithDialog
                            title="Delete Role"
                            description="Are you sure you want to delete this role? This action cannot be undone."
                            onConfirm={() => handleDelete(role.id)}
                            disabled={role.permissions.length === 0}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
