'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job } from '@/constants/mock-api';
import { IconEdit, IconBriefcase } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { CandidateTable } from './candidates-table';
import { columns } from './candidates-table/columns';

const aiQualifiedCandidates = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Senior Software Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/1.png',
    href: '#',
    lastSeen: '2h ago',
    lastSeenDateTime: '2023-01-23T14:23Z',
    score: 89,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Full Stack Developer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/2.png',
    href: '#',
    lastSeen: null,
    score: 92,
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    role: 'Frontend Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/3.png',
    href: '#',
    lastSeen: '1h ago',
    lastSeenDateTime: '2023-01-23T15:23Z',
    score: 85,
  },
];

const allCandidates = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Senior Software Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/1.png',
    href: '#',
    lastSeen: '2h ago',
    lastSeenDateTime: '2023-01-23T14:23Z',
    score: 89,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Full Stack Developer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/2.png',
    href: '#',
    lastSeen: null,
    score: 92,
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    role: 'Frontend Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/3.png',
    href: '#',
    lastSeen: '1h ago',
    lastSeenDateTime: '2023-01-23T15:23Z',
    score: 85,
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Backend Developer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/4.png',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    score: 78,
  },
  {
    name: 'Jessica Martinez',
    email: 'jessica.martinez@example.com',
    role: 'UI/UX Designer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/5.png',
    href: '#',
    lastSeen: null,
    score: 95,
  },
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    role: 'DevOps Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/6.png',
    href: '#',
    lastSeen: '30m ago',
    lastSeenDateTime: '2023-01-23T16:00Z',
    score: 82,
  },
  {
    name: 'Rachel Green',
    email: 'rachel.green@example.com',
    role: 'Product Manager',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/7.png',
    href: '#',
    lastSeen: '4h ago',
    lastSeenDateTime: '2023-01-23T12:23Z',
    score: 71,
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'QA Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/8.png',
    href: '#',
    lastSeen: null,
    score: 88,
  },
];

export default function JobDetails({ job }: { job: Job }) {
  const router = useRouter();

  return (
    <Card className='mx-auto w-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-left text-2xl font-bold'>
          Job Details
        </CardTitle>
        <Button
          variant='outline'
          onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
        >
          <IconEdit className='mr-2 h-4 w-4' />
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        {/* Fixed Icon and Title Section */}
        <div className='mb-6 flex flex-col items-center gap-4 border-b pb-6'>
          <div className='flex h-24 w-24 items-center justify-center rounded-full bg-gray-200'>
            <IconBriefcase className='h-12 w-12 text-gray-600' strokeWidth={2} />
          </div>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>{job.title}</h2>
            <Badge variant='outline' className='mt-2 capitalize'>
              {job.category}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue='details' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='details'>Job Details</TabsTrigger>
            <TabsTrigger value='shortlist'>AI Qualified Shortlist (9)</TabsTrigger>
            <TabsTrigger value='candidates'>All Candidates (100)</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-6 pt-6'>

            {/* Salary */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                Salary
              </h3>
              <p className='text-lg font-semibold'>${job.salary.toLocaleString()}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                Description
              </h3>
              <p className='text-base leading-relaxed'>{job.description}</p>
            </div>

            {/* Metadata */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                  Created At
                </h3>
                <p className='text-sm'>
                  {new Date(job.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                  Last Updated
                </h3>
                <p className='text-sm'>
                  {new Date(job.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='shortlist' className='pt-6'>
            <CandidateTable data={aiQualifiedCandidates} columns={columns} />
          </TabsContent>

          <TabsContent value='candidates' className='pt-6'>
            <CandidateTable data={allCandidates} columns={columns} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
