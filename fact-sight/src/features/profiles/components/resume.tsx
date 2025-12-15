'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, GraduationCap } from 'lucide-react';
import { Profile } from '@/constants/data';

export default function Resume({ profile }: { profile: Profile }) {
  const formatDate = (date: string | null) => {
    if (!date || date === '_' || date === ' ') {
      return '_';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '_';
    }

    return format(parsedDate, 'MMM, yyyy');
  };

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-base font-semibold text-gray-500 pb-4'>
            Resume / CV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-500'>No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mx-4 shadow-none border-none'>
      <CardHeader>
        <CardTitle className='text-base font-semibold text-gray-500 pb-4'>
          Resume / CV
        </CardTitle>
      </CardHeader>
      <CardContent className=''>
        <Accordion type='multiple' className='space-y-0'>
          <AccordionItem value='hard-skills' className='border-b border-gray-200'>
            <AccordionTrigger>
              <div className='flex items-center gap-2 font-semibold text-gray-900'>
                <div className='flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset bg-green-500/10 ring-green-500/20'>
                  <Star className='h-4.5 w-4.5 stroke-[1.3] transition-colors duration-300 fill-green-500/10 stroke-green-600' />
                </div>
                Hard Skills
              </div>
            </AccordionTrigger>
            <AccordionContent className='text-gray-600 text-sm pl-9 flex flex-wrap gap-2'>
              {profile.skills
                ?.filter((skill) => skill.type === 'hard')
                .map((skill, index) => (
                  <Badge key={index} variant='outline' className='capitalize'>
                    {skill.name}
                  </Badge>
                ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='soft-skills' className='border-b border-gray-200'>
            <AccordionTrigger>
              <div className='flex items-center gap-2 font-semibold text-gray-900'>
                <div className='flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset bg-blue-500/10 ring-blue-500/20'>
                  <Star className='h-4.5 w-4.5 stroke-[1.3] transition-colors duration-300 fill-blue-500/10 stroke-blue-600' />
                </div>
                Soft Skills
              </div>
            </AccordionTrigger>
            <AccordionContent className='text-gray-600 text-sm pl-9 flex flex-wrap gap-2'>
              {profile.skills
                ?.filter((skill) => skill.type === 'soft')
                .map((skill, index) => (
                  <Badge key={index} variant='secondary' className='capitalize'>
                    {skill.name}
                  </Badge>
                ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='educations' className='border-b border-gray-200'>
            <AccordionTrigger>
              <div className='flex items-center gap-2 font-semibold text-gray-900'>
                <div className='flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset bg-green-500/10 ring-green-500/20'>
                  <GraduationCap className='h-4.5 w-4.5 stroke-[1.3] transition-colors duration-300 fill-green-500/10 stroke-green-600' />
                </div>
                Education
              </div>
            </AccordionTrigger>
            <AccordionContent className='text-gray-600 text-sm pl-7'>
              <ul role='list' className='space-y-6 pb-8'>
                {profile.educations?.map((education, index) => (
                  <li key={index} className='relative flex gap-x-4'>
                    <div className='-bottom-6 absolute left-0 top-0 flex w-6 justify-center'>
                      <div className='w-px bg-gray-200' />
                    </div>
                    <div className='relative flex size-6 flex-none items-center justify-center bg-white rounded-full border border-gray-200'>
                      <div className='size-1.5 rounded-full bg-green-500 ring-2 ring-green-500/20' />
                    </div>
                    <div className='flex-auto'>
                      <div className='flex justify-between gap-x-4 mb-1'>
                        <div className='py-0.5 text-sm font-medium text-gray-900'>
                          {education.title || '_'}
                        </div>
                        <time className='flex-none py-0.5 text-xs text-gray-500'>
                          {formatDate(education.date_start || '_')} -{' '}
                          {education.date_end === null
                            ? 'Present'
                            : formatDate(education.date_end || '_')}
                        </time>
                      </div>
                      <div className='text-xs text-green-600 mb-2 font-medium'>
                        {education.school || '_'}
                      </div>
                      <p className='text-sm text-gray-600 leading-relaxed'>
                        {education.description || '_'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='experiences' className='border-b border-gray-200'>
            <AccordionTrigger>
              <div className='flex items-center gap-2 font-semibold text-gray-900'>
                <div className='flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset bg-green-500/10 ring-green-500/20'>
                  <Briefcase className='h-4.5 w-4.5 stroke-[1.3] transition-colors duration-300 fill-green-500/10 stroke-green-600' />
                </div>
                Experience
              </div>
            </AccordionTrigger>
            <AccordionContent className='text-gray-600 text-sm pl-7'>
              <ul role='list' className='space-y-6 pb-8'>
                {profile.experiences?.map((experience, index) => (
                  <li key={index} className='relative flex gap-x-4'>
                    <div className='-bottom-6 absolute left-0 top-0 flex w-6 justify-center'>
                      <div className='w-px bg-gray-200' />
                    </div>
                    <div className='relative flex size-6 flex-none items-center justify-center bg-white rounded-full border border-gray-200'>
                      <div className='size-1.5 rounded-full bg-green-500 ring-2 ring-green-500/20' />
                    </div>
                    <div className='flex-auto'>
                      <div className='flex justify-between gap-x-4 mb-1'>
                        <div className='py-0.5 text-sm font-medium text-gray-900'>
                          {experience.title || '_'}
                        </div>
                        <time className='flex-none py-0.5 text-xs text-gray-500'>
                          {experience.date_start
                            ? formatDate(experience.date_start || ' ')
                            : ' '}{' '}
                          -{' '}
                          {experience.date_end === null
                            ? 'Present'
                            : formatDate(experience.date_end || '_')}
                        </time>
                      </div>
                      <div className='text-xs text-green-600 mb-2 font-medium'>
                        {experience.company || '_'}
                      </div>
                      <p className='text-sm text-gray-600 leading-relaxed'>
                        {experience.description || '_'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
