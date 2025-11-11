import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  {
    title: 'Create',
    href: '#',
  },
];

export default function PermissionsCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(RoutePermission.store.url());
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-4 py-2">
        <Head title="Create Permission" />

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create Permission</h1>
              <p className="text-muted-foreground">Add a new permission to the system</p>
            </div>
            <Link href="/settings/permissions" className="mt-4 ml-auto md:mt-0">
              <Button variant={'default'}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mx-auto max-w-sm">
              <CardHeader>
                <CardTitle>Permission Information</CardTitle>
                <CardDescription>Enter the details of the new permission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Permission Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="e.g., Edit Posts"
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="flex justify-end gap-2">
                  <Link href={RoutePermission.index.url()}>
                    <Button type="button" variant="outline" disabled={processing}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Creating...' : 'Create Permission'}
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
