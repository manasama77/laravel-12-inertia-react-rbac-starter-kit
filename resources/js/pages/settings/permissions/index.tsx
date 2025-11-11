import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

import { ButtonDeleteWithDialog } from '@/components/button-delete-with-dialog';
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
import RoutePermission from '@/routes/permissions';
import RouteProfile from '@/routes/profile';

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
    title: 'Permissions',
    href: RoutePermission.index.url(),
  },
];

interface Permission {
  id: number;
  name: string;
  created_at: string;
}

interface PaginatedPermissions {
  data: Permission[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function PermissionsIndex({ permissions }: { permissions: PaginatedPermissions }) {
  const handleDelete = (id: number) => {
    router.delete(RoutePermission.destroy.url(id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-4 py-2">
        <Head title="Permissions Management" />

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Permissions Management
              </h1>
              <p className="text-muted-foreground">Manage system permissions</p>
            </div>
            <Link href={RoutePermission.create.url()} className="mt-4 ml-auto md:mt-0">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Permission
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>A list of all permissions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.data.map(permission => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={RoutePermission.edit.url(permission.id)}>
                            <Button
                              variant={'default'}
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-500/70 hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <ButtonDeleteWithDialog
                            title="Delete Permission"
                            description="Are you sure you want to delete this permission? This action cannot be undone."
                            onConfirm={() => handleDelete(permission.id)}
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
