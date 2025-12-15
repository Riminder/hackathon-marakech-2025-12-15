'use client';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { IconEye } from '@tabler/icons-react';
import Image from 'next/image';
import CandidateDetailsContent from './candidate-details-content';

export type Candidate = {
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  href?: string;
  lastSeen: string | null;
  lastSeenDateTime?: string;
  score: number;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  experiences?: Array<{
    title: string;
    company: string;
    date_start: string;
    date_end: string | null;
    description: string;
  }>;
  educations?: Array<{
    title: string;
    school: string;
    date_start: string;
    date_end: string | null;
    description: string;
  }>;
  skills?: Array<{
    name: string;
    type: 'hard' | 'soft';
  }>;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

const renderCircularScore = (score: number) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className='relative mx-auto flex h-12 w-12 items-center justify-center'>
      <svg className='absolute h-12 w-12 -rotate-90 transform'>
        {/* Background circle */}
        <circle
          cx='24'
          cy='24'
          r={radius}
          stroke='#e5e7eb'
          strokeWidth='4'
          fill='none'
        />
        {/* Progress circle */}
        <circle
          cx='24'
          cy='24'
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth='4'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
        />
      </svg>
      <span className='text-xs font-bold'>{score}%</span>
    </div>
  );
};

const getRankColor = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500';
  if (rank === 2) return 'bg-gray-400';
  if (rank === 3) return 'bg-amber-700';
  return 'bg-blue-500';
};

export const columns: ColumnDef<Candidate>[] = [
  {
    id: 'rank',
    header: 'RANK',
    cell: ({ row }) => {
      const rank = row.index + 1;
      return (
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getRankColor(rank)} text-white font-bold text-sm`}>
          #{rank}
        </div>
      );
    }
  },
  {
    accessorKey: 'imageUrl',
    header: 'IMAGE',
    cell: ({ row }) => {
      return (
        <div className='relative h-10 w-10'>
          <Image
            src={row.getValue('imageUrl')}
            alt={row.getValue('name')}
            fill
            className='rounded-full object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Candidate, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<string>()}</div>
  },
  {
    id: 'score1',
    accessorKey: 'score',
    header: 'HARD SKILLS',
    cell: ({ row }) => {
      const score = row.original.score;
      return renderCircularScore(score);
    }
  },
  {
    id: 'score2',
    header: 'SOFT SKILLS',
    cell: ({ row }) => {
      const score = row.original.score;
      const secondScore = Math.floor(score * 0.2);
      return renderCircularScore(secondScore);
    }
  },
  {
    id: 'score3',
    header: 'REFERENCES',
    cell: ({ row }) => {
      const score = row.original.score;
      const thirdScore = Math.floor(score * 0.1);
      return renderCircularScore(thirdScore);
    }
  },
  {
    accessorKey: 'role',
    header: 'ROLE'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue('email')}`}
        className='text-muted-foreground hover:underline'
      >
        {row.getValue('email')}
      </a>
    )
  },
  {
    id: 'actions',
    header: 'DETAILS',
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Badge variant='secondary' className='cursor-pointer gap-1.5 px-3 py-1.5'>
              <IconEye className='h-3.5 w-3.5' />
              Details
            </Badge>
          </DialogTrigger>
          <DialogContent className='max-w-7xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold'>Personal Information</DialogTitle>
            </DialogHeader>
            <CandidateDetailsContent candidate={row.original} />
          </DialogContent>
        </Dialog>
      );
    }
  }
];
