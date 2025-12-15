'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Job } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Link from 'next/link';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Job>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<Job, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <Link
        href={`/dashboard/jobs/${row.original.id}`}
        className='hover:underline cursor-pointer font-medium'
      >
        {row.getValue('title')}
      </Link>
    ),
    meta: {
      label: 'Title',
      placeholder: 'Search jobs...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'ai_qualified',
    header: 'AI QUALIFIED SHORTLIST',
    cell: ({ row }) => {
      // Generate a consistent random number based on job id
      const aiQualified = Math.floor((row.original.id * 7) % 20) + 5;
      return (
        <div className='flex justify-center'>
          <Badge variant='outline'>{aiQualified}</Badge>
        </div>
      );
    }
  },
  {
    id: 'all_candidates',
    header: 'ALL CANDIDATES',
    cell: ({ row }) => {
      // Generate a consistent random number based on job id
      const allCandidates = Math.floor((row.original.id * 13) % 100) + 50;
      return (
        <div className='flex justify-center'>
          <Badge variant='outline'>{allCandidates}</Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'requirements',
    header: 'REQUIREMENTS',
    cell: ({ row }) => {
      const requirements = row.getValue('requirements') as string;
      const words = requirements.split(' ').slice(0, 5).join(' ');
      return <div className='max-w-xs text-sm text-muted-foreground'>{words}...</div>;
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
