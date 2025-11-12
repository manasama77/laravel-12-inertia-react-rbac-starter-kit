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
import RouteUsers from '@/routes/users';

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
    title: 'Users',
    href: RouteUsers.index.url(),
  },
];

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: Role[];
  created_at: string;
}

interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function UsersIndex({ users }: { users: PaginatedUsers }) {
  const handleDelete = (id: number) => {
    router.delete(RouteUsers.destroy.url(id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-4 py-2">
        <Head title="Users Management" />

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users Management</h1>
              <p className="text-muted-foreground">Manage system users and their roles</p>
            </div>
            <Link href={RouteUsers.create.url()} className="mt-4 ml-auto md:mt-0">
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>A list of all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <Badge key={role.id} variant="secondary">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={RouteUsers.edit.url(user.id)}>
                            <Button
                              variant={'default'}
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-500/70 hover:text-white"
                              disabled={user.id === 1}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <ButtonDeleteWithDialog
                            title="Delete User"
                            description="Are you sure you want to delete this user? This action cannot be undone."
                            onConfirm={() => handleDelete(user.id)}
                            disabled={user.id === 1}
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
