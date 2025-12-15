'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Profile } from '@/constants/data';
import PersonalInfo from './personal-info';
import Resume from './resume';
import { Separator } from '@/components/ui/separator';

interface ProfileDetailsDialogProps {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDetailsDialog({
  profile,
  open,
  onOpenChange
}: ProfileDetailsDialogProps) {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Profile Details</DialogTitle>
        </DialogHeader>
        <div className='mt-5 flex flex-col gap-4'>
          <div className='w-full overflow-hidden rounded-lg bg-white shadow-sm outline outline-black/5 py-2 gap-4 flex flex-col'>
            <PersonalInfo profile={profile} />
            <Separator />
            <Resume profile={profile} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
