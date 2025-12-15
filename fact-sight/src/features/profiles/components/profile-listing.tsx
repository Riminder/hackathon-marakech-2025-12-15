import { Profile } from '@/constants/data';
import { fakeProfiles } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { ProfileTable } from './profile-tables';
import { columns } from './profile-tables/columns';

type ProfileListingPage = {};

export default async function ProfileListingPage({}: ProfileListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await fakeProfiles.getProfiles(filters);
  const totalProfiles = data.total_profiles;
  const profiles: Profile[] = data.profiles;

  return (
    <ProfileTable
      data={profiles}
      totalItems={totalProfiles}
      columns={columns}
    />
  );
}
