'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  MapPin,
  Mail,
  Briefcase,
  Calendar,
  Tag,
  Phone,
  Globe,
  Github,
  Linkedin,
  Building2,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import type { Candidate } from './columns';

const getScoreColor = (score: number) => {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

const renderCircularScore = (score: number) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className='relative mx-auto flex h-16 w-16 items-center justify-center'>
      <svg className='absolute h-16 w-16 -rotate-90 transform'>
        {/* Background circle */}
        <circle
          cx='32'
          cy='32'
          r={radius}
          stroke='#e5e7eb'
          strokeWidth='6'
          fill='none'
        />
        {/* Progress circle */}
        <circle
          cx='32'
          cy='32'
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth='6'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
        />
      </svg>
      <span className='text-sm font-bold'>{score}%</span>
    </div>
  );
};

export default function CandidateDetailsContent({ candidate }: { candidate: Candidate }) {
  const formatDate = (date: string | null | undefined) => {
    if (!date || date === '_' || date === ' ') {
      return '_';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '_';
    }

    return format(parsedDate, 'MMM, yyyy');
  };

  const formatFullDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy');
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Personal Info */}
      <Card className='shadow-none border-none'>
        <CardContent className='pt-2'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3 px-2'>
              <div className='p-1 bg-white rounded-full inline-flex border border-gray-200 shadow'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={candidate.imageUrl} />
                  <AvatarFallback className='bg-gray-100 text-gray-700'>
                    {candidate.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='flex flex-col'>
                <span className='text-md font-semibold pb-0.5 text-gray-900'>
                  {candidate.name}
                </span>
                {candidate.location && (
                  <span className='flex items-center gap-1 text-xs text-gray-600 pb-0 mb-0'>
                    <MapPin className='w-3.5 h-3.5' />
                    {candidate.location}
                  </span>
                )}
                {candidate.role && (
                  <span className='flex items-center gap-1 text-xs text-gray-600 pb-0 mb-0 pt-0.5'>
                    <Briefcase className='w-3.5 h-3.5' />
                    {candidate.role}
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-3 px-2'>
              {candidate.website && (
                <Link
                  href={candidate.website}
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  title='Website'
                >
                  <Globe className='w-4.5 h-4.5' />
                </Link>
              )}
              {candidate.linkedin && (
                <Link
                  href={candidate.linkedin}
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  title='LinkedIn'
                >
                  <Linkedin className='w-4.5 h-4.5' />
                </Link>
              )}
              {candidate.github && (
                <Link
                  href={candidate.github}
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  title='GitHub'
                >
                  <Github className='w-4.5 h-4.5' />
                </Link>
              )}
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 px-4'>
            {candidate.email && (
              <ProfileDataCard Icon={Mail} label='Email' value={candidate.email} />
            )}
            {candidate.phone && (
              <ProfileDataCard Icon={Phone} label='Phone' value={candidate.phone} />
            )}
            {candidate.experiences && candidate.experiences.length > 0 && (
              <ProfileDataCard
                Icon={Briefcase}
                label='Years of Experience'
                value={`${candidate.experiences.length} positions`}
              />
            )}
            {candidate.created_at && (
              <ProfileDataCard
                Icon={Calendar}
                label='Creation Date'
                value={formatFullDate(candidate.created_at)}
              />
            )}
            {candidate.updated_at && (
              <ProfileDataCard
                Icon={Calendar}
                label='Last Updated'
                value={formatFullDate(candidate.updated_at)}
              />
            )}
            {candidate.category && (
              <ProfileDataCard Icon={Tag} label='Category' value={candidate.category} />
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className='w-full' />

      {/* Scores */}
      <div className='flex flex-col items-center gap-8 py-8'>
        <div className='flex w-full items-center justify-around gap-8'>
          <div className='flex flex-col items-center gap-3'>
            {renderCircularScore(candidate.score)}
            <span className='text-sm font-medium text-gray-900'>Hard Skills</span>
          </div>

          <div className='flex flex-col items-center gap-3'>
            {renderCircularScore(Math.floor(candidate.score * 0.2))}
            <span className='text-sm font-medium text-gray-900'>Soft Skills</span>
          </div>

          <div className='flex flex-col items-center gap-3'>
            {renderCircularScore(Math.floor(candidate.score * 0.1))}
            <span className='text-sm font-medium text-gray-900'>Reference</span>
          </div>
        </div>

        <Separator className='w-full' />

        <div className='w-full grid grid-cols-2 gap-8 px-8'>
          <div>
            <h4 className='text-xs font-semibold text-green-700 mb-3'>Strengths</h4>
            <div className='text-xs text-gray-600 space-y-1'>
              <div>• Expert in React & TypeScript</div>
              <div>• Strong problem-solving skills</div>
              <div>• Cloud architecture knowledge</div>
              <div>• Excellent communication</div>
              <div>• Team collaboration</div>
              <div>• Leadership potential</div>
              <div>• Highly recommended</div>
              <div>• Consistent performer</div>
              <div>• Strong work ethic</div>
            </div>
          </div>
          <div>
            <h4 className='text-xs font-semibold text-red-700 mb-3'>Weaknesses</h4>
            <div className='text-xs text-gray-600 space-y-1'>
              <div>• Limited backend experience</div>
              <div>• Needs more DevOps exposure</div>
              <div>• Time management needs work</div>
              <div>• Public speaking anxiety</div>
              <div>• Limited reference checks</div>
              <div>• Gaps in work history</div>
            </div>
          </div>
        </div>
      </div>

      {/* Radial Connection Design */}
      <div className='relative w-full h-[550px] mt-8'>
        {/* Concentric circles background */}
        <svg className='absolute inset-0 w-full h-full' style={{ zIndex: 0 }}>
          {[...Array(7)].map((_, i) => (
            <circle
              key={i}
              cx='50%'
              cy='50%'
              r={50 + i * 50}
              fill='none'
              stroke='#f3f4f6'
              strokeWidth='1'
            />
          ))}

          {/* Lines connecting center to cards */}
          {/* Line to top-right card */}
          <line x1='50%' y1='50%' x2='85%' y2='18%' stroke='#e5e7eb' strokeWidth='2' strokeDasharray='5,5' />
          {/* Line to left card */}
          <line x1='50%' y1='50%' x2='8%' y2='50%' stroke='#e5e7eb' strokeWidth='2' strokeDasharray='5,5' />
          {/* Line to bottom-right card */}
          <line x1='50%' y1='50%' x2='85%' y2='82%' stroke='#e5e7eb' strokeWidth='2' strokeDasharray='5,5' />
        </svg>

        {/* Center Avatar */}
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <div className='p-2 bg-white rounded-full border-4 border-gray-200 shadow-lg'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={candidate.imageUrl} />
              <AvatarFallback className='bg-gray-100 text-gray-700 text-xl'>
                {candidate.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Experience Card 1 - Top Right */}
        <Card className='absolute top-[8%] right-[1%] w-44 shadow-lg z-10 border-2'>
          <CardContent className='pt-2.5 pb-2.5'>
            <div className='flex items-start gap-2 mb-2'>
              <Building2 className='w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0' />
              <div className='flex-1'>
                <h4 className='text-xs font-semibold text-gray-900'>Tech Corp</h4>
                <p className='text-[10px] text-gray-500'>Senior Software Engineer</p>
              </div>
            </div>
            <div className='space-y-1 mt-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <CheckCircle2 className='w-2.5 h-2.5 text-green-600' />
                  <span className='text-[10px] text-gray-600'>Validated Tasks</span>
                </div>
                <span className='text-[10px] font-semibold text-gray-900'>7/9</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <TrendingUp className='w-2.5 h-2.5 text-purple-600' />
                  <span className='text-[10px] text-gray-600'>Overall Score</span>
                </div>
                <span className='text-[10px] font-semibold text-green-600'>92%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Card 2 - Left */}
        <Card className='absolute top-1/2 left-0 -translate-y-1/2 w-44 shadow-lg z-10 border-2'>
          <CardContent className='pt-2.5 pb-2.5'>
            <div className='flex items-start gap-2 mb-2'>
              <Building2 className='w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0' />
              <div className='flex-1'>
                <h4 className='text-xs font-semibold text-gray-900'>StartupXYZ</h4>
                <p className='text-[10px] text-gray-500'>Full Stack Developer</p>
              </div>
            </div>
            <div className='space-y-1 mt-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <CheckCircle2 className='w-2.5 h-2.5 text-green-600' />
                  <span className='text-[10px] text-gray-600'>Validated Tasks</span>
                </div>
                <span className='text-[10px] font-semibold text-gray-900'>5/8</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <TrendingUp className='w-2.5 h-2.5 text-purple-600' />
                  <span className='text-[10px] text-gray-600'>Overall Score</span>
                </div>
                <span className='text-[10px] font-semibold text-yellow-600'>78%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Card 3 - Bottom Right */}
        <Card className='absolute bottom-[8%] right-[1%] w-44 shadow-lg z-10 border-2'>
          <CardContent className='pt-2.5 pb-2.5'>
            <div className='flex items-start gap-2 mb-2'>
              <Building2 className='w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0' />
              <div className='flex-1'>
                <h4 className='text-xs font-semibold text-gray-900'>Digital Agency</h4>
                <p className='text-[10px] text-gray-500'>Frontend Developer</p>
              </div>
            </div>
            <div className='space-y-1 mt-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <CheckCircle2 className='w-2.5 h-2.5 text-green-600' />
                  <span className='text-[10px] text-gray-600'>Validated Tasks</span>
                </div>
                <span className='text-[10px] font-semibold text-gray-900'>8/10</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <TrendingUp className='w-2.5 h-2.5 text-purple-600' />
                  <span className='text-[10px] text-gray-600'>Overall Score</span>
                </div>
                <span className='text-[10px] font-semibold text-green-600'>85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileDataCard({
  Icon,
  label,
  value
}: {
  Icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='flex h-9 w-9 items-center justify-center rounded-full transition duration-300 ring-1 bg-gray-50 ring-gray-200 shadow-sm'>
        <Icon className='h-4.5 w-4.5 stroke-[1.3] transition-colors duration-300 text-gray-600' />
      </div>
      <div className='space-y-1 min-w-0 flex-1'>
        <p className='text-sm text-gray-900 font-medium'>{label}</p>
        <p className='text-sm/3 text-gray-600 break-all'>{value}</p>
      </div>
    </div>
  );
}
