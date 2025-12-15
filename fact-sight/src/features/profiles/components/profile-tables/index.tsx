'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useState } from 'react';
import { Profile } from '@/constants/data';
import ProfileDetailsDialog from '../profile-details-dialog';
import { createColumns } from './columns';

interface ProfileTableParams {
  data: Profile[];
  totalItems: number;
}

export function ProfileTable({ data, totalItems }: ProfileTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pageCount = Math.ceil(totalItems / pageSize);

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
  };

  const columns = createColumns(handleProfileClick);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <ProfileDetailsDialog
        profile={selectedProfile}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
