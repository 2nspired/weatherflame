'use client';

import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '~/app/main/_components/shadcn/breadcrumb';

export default function BreadcrumbRoute() {
  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const pathArrayFiltered = pathArray.filter((path) => path !== '');

  const createPath = (index: number) => {
    return '/' + pathArrayFiltered.slice(0, index + 1).join('/');
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-black">
        {pathArrayFiltered.map((path, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink href={createPath(index)}>{path}</BreadcrumbLink>/
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
