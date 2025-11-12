import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  const page = usePage<SharedData>();
  const { name: appName } = page.props;

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex aspect-auto items-center justify-center text-sidebar-primary-foreground">
        <AppLogoIcon className="w-14" />
      </div>
      <div className="grid flex-1 place-self-end text-left text-sm">
        <span className="truncate leading-tight font-semibold">{appName}</span>
      </div>
    </div>
  );
}
