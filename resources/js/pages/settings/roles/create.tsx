import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  {
    title: 'Create',
    href: '#',
  },
];

interface Permission {
  id: number;
  name: string;
}

export default function RolesCreate({ permissions }: { permissions: Permission[] }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: [] as number[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(RouteRole.store.url());
  };

  const handlePermissionToggle = (permissionId: number) => {
    setData(
      'permissions',
      data.permissions.includes(permissionId)
        ? data.permissions.filter(id => id !== permissionId)
        : [...data.permissions, permissionId]
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-4 py-2">
        <Head title="Create Role" />

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create Role</h1>
              <p className="text-muted-foreground">Add a new role to the system</p>
            </div>
            <Link href={RouteRole.index.url()} className="mt-4 ml-auto md:mt-0">
              <Button variant={'default'}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
                <CardDescription>Enter the details of the new role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      placeholder="e.g., Manager"
                      required
                    />
                    <InputError message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={data.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <InputError message={errors.permissions} />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href={RouteRole.index.url()}>
                    <Button type="button" variant="outline" disabled={processing}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Creating...' : 'Create Role'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
