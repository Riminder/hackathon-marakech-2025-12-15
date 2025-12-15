import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { fakeJobs, Job } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import JobForm from '@/features/jobs/components/job-form';

export const metadata = {
  title: 'Dashboard : Edit Job'
};

type PageProps = { params: Promise<{ jobId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const data = await fakeJobs.getJobById(Number(params.jobId));
  const job = data.job as Job;

  if (!job) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <JobForm initialData={job} pageTitle="Edit Job" />
        </Suspense>
      </div>
    </PageContainer>
  );
}
