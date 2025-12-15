import { fakeProfiles, Profile } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import ProfileForm from './profile-form';

type TProfileViewPageProps = {
  profileId: string;
};

export default async function ProfileViewPage({
  profileId
}: TProfileViewPageProps) {
  let profile = null;
  let pageTitle = 'Create New Profile';

  if (profileId !== 'new') {
    const data = await fakeProfiles.getProfileById(Number(profileId));
    profile = data.profile as Profile;
    if (!profile) {
      notFound();
    }
    pageTitle = `Edit Profile`;
  }

  return <ProfileForm initialData={profile} pageTitle={pageTitle} />;
}
