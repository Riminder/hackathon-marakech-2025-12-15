'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job } from '@/constants/mock-api';
import { IconEdit, IconBriefcase } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { CandidateTable } from './candidates-table';
import { columns, type Candidate } from './candidates-table/columns';

const aiQualifiedCandidates: Candidate[] = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Senior Software Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/1.png',
    href: '#',
    lastSeen: '2h ago',
    lastSeenDateTime: '2023-01-23T14:23Z',
    score: 89,
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, USA',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    github: 'https://github.com/sarahjohnson',
    website: 'https://sarahjohnson.dev',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-12-10T14:30:00Z',
    category: 'Developer',
    experiences: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        date_start: '2021-03-01T00:00:00Z',
        date_end: null,
        description: 'Leading development of cloud-based solutions using React, Node.js, and AWS.'
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        date_start: '2018-06-01T00:00:00Z',
        date_end: '2021-02-28T00:00:00Z',
        description: 'Developed full-stack web applications and improved system performance by 40%.'
      }
    ],
    educations: [
      {
        title: 'Bachelor of Science in Computer Science',
        school: 'Stanford University',
        date_start: '2014-09-01T00:00:00Z',
        date_end: '2018-05-31T00:00:00Z',
        description: 'Focused on software engineering and distributed systems.'
      }
    ],
    skills: [
      { name: 'JavaScript', type: 'hard' },
      { name: 'React', type: 'hard' },
      { name: 'Node.js', type: 'hard' },
      { name: 'AWS', type: 'hard' },
      { name: 'TypeScript', type: 'hard' },
      { name: 'Leadership', type: 'soft' },
      { name: 'Communication', type: 'soft' }
    ]
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Full Stack Developer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/2.png',
    href: '#',
    lastSeen: null,
    score: 92,
    phone: '+1 (555) 234-5678',
    location: 'New York, USA',
    linkedin: 'https://linkedin.com/in/michaelchen',
    github: 'https://github.com/michaelchen',
    website: 'https://michaelchen.io',
    created_at: '2022-08-20T10:00:00Z',
    updated_at: '2024-12-12T09:15:00Z',
    category: 'Developer',
    experiences: [
      {
        title: 'Full Stack Developer',
        company: 'Digital Solutions Inc',
        date_start: '2020-01-15T00:00:00Z',
        date_end: null,
        description: 'Building scalable web applications with Vue.js, Python, and PostgreSQL.'
      },
      {
        title: 'Junior Developer',
        company: 'WebDev Co',
        date_start: '2018-07-01T00:00:00Z',
        date_end: '2019-12-31T00:00:00Z',
        description: 'Developed responsive websites and maintained legacy codebases.'
      }
    ],
    educations: [
      {
        title: 'Master of Science in Data Science',
        school: 'MIT',
        date_start: '2016-09-01T00:00:00Z',
        date_end: '2018-05-31T00:00:00Z',
        description: 'Specialized in machine learning and data analytics.'
      }
    ],
    skills: [
      { name: 'Python', type: 'hard' },
      { name: 'Vue.js', type: 'hard' },
      { name: 'PostgreSQL', type: 'hard' },
      { name: 'Docker', type: 'hard' },
      { name: 'Problem Solving', type: 'soft' },
      { name: 'Teamwork', type: 'soft' }
    ]
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
    phone: '+1 (555) 345-6789',
    location: 'Austin, USA',
    linkedin: 'https://linkedin.com/in/emilyrodriguez',
    github: 'https://github.com/emilyrodriguez',
    created_at: '2023-03-10T10:00:00Z',
    updated_at: '2024-12-08T16:45:00Z',
    category: 'Developer',
    experiences: [
      {
        title: 'Frontend Engineer',
        company: 'Creative Tech',
        date_start: '2021-06-01T00:00:00Z',
        date_end: null,
        description: 'Creating beautiful and performant user interfaces with React and Next.js.'
      }
    ],
    educations: [
      {
        title: 'Bachelor of Arts in Design',
        school: 'UC Berkeley',
        date_start: '2017-09-01T00:00:00Z',
        date_end: '2021-05-31T00:00:00Z',
        description: 'Combined design thinking with web development skills.'
      }
    ],
    skills: [
      { name: 'React', type: 'hard' },
      { name: 'Next.js', type: 'hard' },
      { name: 'CSS', type: 'hard' },
      { name: 'Figma', type: 'hard' },
      { name: 'Creativity', type: 'soft' },
      { name: 'Adaptability', type: 'soft' }
    ]
  },
];

const allCandidates: Candidate[] = [
  ...aiQualifiedCandidates,
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Backend Developer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/4.png',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    score: 78,
    phone: '+1 (555) 456-7890',
    location: 'Seattle, USA',
    linkedin: 'https://linkedin.com/in/davidkim',
    github: 'https://github.com/davidkim',
    created_at: '2022-11-05T10:00:00Z',
    updated_at: '2024-12-11T11:20:00Z',
    category: 'Developer',
    experiences: [
      {
        title: 'Backend Developer',
        company: 'API Systems Ltd',
        date_start: '2019-09-01T00:00:00Z',
        date_end: null,
        description: 'Building scalable REST APIs and microservices using Java and Spring Boot.'
      }
    ],
    educations: [
      {
        title: 'Bachelor of Engineering',
        school: 'University of Washington',
        date_start: '2015-09-01T00:00:00Z',
        date_end: '2019-05-31T00:00:00Z',
        description: 'Computer Engineering with focus on system design.'
      }
    ],
    skills: [
      { name: 'Java', type: 'hard' },
      { name: 'Spring Boot', type: 'hard' },
      { name: 'Kubernetes', type: 'hard' },
      { name: 'Problem Solving', type: 'soft' }
    ]
  },
  {
    name: 'Jessica Martinez',
    email: 'jessica.martinez@example.com',
    role: 'UI/UX Designer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/5.png',
    href: '#',
    lastSeen: null,
    score: 95,
    phone: '+1 (555) 567-8901',
    location: 'Los Angeles, USA',
    linkedin: 'https://linkedin.com/in/jessicamartinez',
    website: 'https://jessicamartinez.design',
    created_at: '2021-07-12T10:00:00Z',
    updated_at: '2024-12-13T08:00:00Z',
    category: 'Designer',
    experiences: [
      {
        title: 'UI/UX Designer',
        company: 'Creative Studios',
        date_start: '2020-04-01T00:00:00Z',
        date_end: null,
        description: 'Designing user-centered interfaces for web and mobile applications.'
      }
    ],
    educations: [
      {
        title: 'Bachelor of Arts in Design',
        school: 'Rhode Island School of Design',
        date_start: '2016-09-01T00:00:00Z',
        date_end: '2020-05-31T00:00:00Z',
        description: 'UX/UI Design specialization.'
      }
    ],
    skills: [
      { name: 'Figma', type: 'hard' },
      { name: 'Adobe XD', type: 'hard' },
      { name: 'User Research', type: 'hard' },
      { name: 'Creativity', type: 'soft' }
    ]
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
    phone: '+1 (555) 678-9012',
    location: 'Denver, USA',
    linkedin: 'https://linkedin.com/in/alexthompson',
    github: 'https://github.com/alexthompson',
    created_at: '2022-05-18T10:00:00Z',
    updated_at: '2024-12-14T10:30:00Z',
    category: 'Engineer',
    experiences: [
      {
        title: 'DevOps Engineer',
        company: 'Cloud Services Inc',
        date_start: '2021-02-01T00:00:00Z',
        date_end: null,
        description: 'Managing CI/CD pipelines and infrastructure automation using Kubernetes and Terraform.'
      }
    ],
    educations: [
      {
        title: 'Bachelor of Science in Information Technology',
        school: 'University of Colorado',
        date_start: '2017-09-01T00:00:00Z',
        date_end: '2021-05-31T00:00:00Z',
        description: 'Cloud computing and DevOps focus.'
      }
    ],
    skills: [
      { name: 'Kubernetes', type: 'hard' },
      { name: 'Docker', type: 'hard' },
      { name: 'Terraform', type: 'hard' },
      { name: 'AWS', type: 'hard' },
      { name: 'Adaptability', type: 'soft' }
    ]
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
    phone: '+1 (555) 789-0123',
    location: 'Chicago, USA',
    linkedin: 'https://linkedin.com/in/rachelgreen',
    created_at: '2023-02-22T10:00:00Z',
    updated_at: '2024-12-09T13:00:00Z',
    category: 'Manager',
    experiences: [
      {
        title: 'Product Manager',
        company: 'Product Co',
        date_start: '2020-08-01T00:00:00Z',
        date_end: null,
        description: 'Leading product strategy and roadmap for SaaS platform.'
      }
    ],
    educations: [
      {
        title: 'Master of Business Administration',
        school: 'Northwestern University',
        date_start: '2018-09-01T00:00:00Z',
        date_end: '2020-05-31T00:00:00Z',
        description: 'Product Management specialization.'
      }
    ],
    skills: [
      { name: 'Product Strategy', type: 'hard' },
      { name: 'Agile', type: 'hard' },
      { name: 'Leadership', type: 'soft' },
      { name: 'Communication', type: 'soft' }
    ]
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'QA Engineer',
    imageUrl: 'https://api.slingacademy.com/public/sample-users/8.png',
    href: '#',
    lastSeen: null,
    score: 88,
    phone: '+1 (555) 890-1234',
    location: 'Boston, USA',
    linkedin: 'https://linkedin.com/in/jameswilson',
    github: 'https://github.com/jameswilson',
    created_at: '2022-09-30T10:00:00Z',
    updated_at: '2024-12-07T15:30:00Z',
    category: 'Engineer',
    experiences: [
      {
        title: 'QA Engineer',
        company: 'Quality Solutions',
        date_start: '2020-03-01T00:00:00Z',
        date_end: null,
        description: 'Developing automated test frameworks and ensuring software quality.'
      }
    ],
    educations: [
      {
        title: 'Bachelor of Science in Computer Science',
        school: 'Boston University',
        date_start: '2016-09-01T00:00:00Z',
        date_end: '2020-05-31T00:00:00Z',
        description: 'Software testing and quality assurance focus.'
      }
    ],
    skills: [
      { name: 'Selenium', type: 'hard' },
      { name: 'Python', type: 'hard' },
      { name: 'Test Automation', type: 'hard' },
      { name: 'Attention to Detail', type: 'soft' }
    ]
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
                  Updated At
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

            {/* Requirements */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                Requirements
              </h3>
              <p className='text-base leading-relaxed'>{job.requirements}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                Responsibilities
              </h3>
              <p className='text-base leading-relaxed'>{job.responsibilities}</p>
            </div>

            {/* Skills */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                Skills
              </h3>
              <div className='flex flex-wrap gap-2'>
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant='secondary'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Internal Notes  */}
            <div>
              <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
              Internal Notes
              </h3>
              <p className='text-base leading-relaxed'>{job.responsibilities}</p>
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
