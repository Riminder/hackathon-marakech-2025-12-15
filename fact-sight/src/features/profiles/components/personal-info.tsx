'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Linkedin
} from 'lucide-react';
import { Profile } from '@/constants/data';

export default function PersonalInfo({ profile }: { profile: Profile }) {
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy');
  };

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-base font-semibold text-gray-500 pb-4'>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-500'>No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  const name = profile.name || 'Unknown';
  const photo = profile.photo_url || '/profile-placeholder.png';
  const location = profile.location || '';
  const lastExperienceTitle = profile.experiences?.[0]?.title || '';
  const email = profile.email || '';
  const phone = profile.phone || '';
  const createdAt = profile.created_at;
  const updatedAt = profile.updated_at;

  return (
    <Card className='mx-4 shadow-none border-none'>
      <CardHeader>
        <CardTitle className='text-base font-semibold text-gray-500 pb-4'>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 px-2'>
            <div className='p-1 bg-white rounded-full inline-flex border border-gray-200 shadow'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={photo} />
                <AvatarFallback className='bg-gray-100 text-gray-700'>
                  {name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col'>
              <span className='text-md font-semibold pb-0.5 text-gray-900'>
                {name}
              </span>
              {location && (
                <span className='flex items-center gap-1 text-xs text-gray-600 pb-0 mb-0'>
                  <MapPin className='w-3.5 h-3.5' />
                  {location}
                </span>
              )}
              {lastExperienceTitle && (
                <span className='flex items-center gap-1 text-xs text-gray-600 pb-0 mb-0 pt-0.5'>
                  <Briefcase className='w-3.5 h-3.5' />
                  {lastExperienceTitle}
                </span>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3 px-2'>
            {profile.website && (
              <Link
                href={profile.website}
                className='text-gray-600 hover:text-gray-900 transition-colors'
                title='Website'
              >
                <Globe className='w-4.5 h-4.5' />
              </Link>
            )}
            {profile.linkedin && (
              <Link
                href={profile.linkedin}
                className='text-gray-600 hover:text-gray-900 transition-colors'
                title='LinkedIn'
              >
                <Linkedin className='w-4.5 h-4.5' />
              </Link>
            )}
            {profile.github && (
              <Link
                href={profile.github}
                className='text-gray-600 hover:text-gray-900 transition-colors'
                title='GitHub'
              >
                <Github className='w-4.5 h-4.5' />
              </Link>
            )}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-10 mb-4'>
          {email && <ProfileDataCard Icon={Mail} label='Email' value={email} />}
          {phone && <ProfileDataCard Icon={Phone} label='Phone' value={phone} />}
          {profile.experiences && profile.experiences.length > 0 && (
            <ProfileDataCard
              Icon={Briefcase}
              label='Years of Experience'
              value={`${profile.experiences.length} positions`}
            />
          )}
          {createdAt && (
            <ProfileDataCard
              Icon={Calendar}
              label='Creation Date'
              value={formatDate(createdAt)}
            />
          )}
          {updatedAt && (
            <ProfileDataCard
              Icon={Calendar}
              label='Last Updated'
              value={formatDate(updatedAt)}
            />
          )}
          {profile.category && (
            <ProfileDataCard
              Icon={Tag}
              label='Category'
              value={profile.category}
            />
          )}
        </div>
      </CardContent>
    </Card>
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
