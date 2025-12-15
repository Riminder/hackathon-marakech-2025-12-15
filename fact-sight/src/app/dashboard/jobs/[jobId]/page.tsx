import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import JobViewPage from '@/features/jobs/components/job-view-page';

export const metadata = {
  title: 'Dashboard : Job View'
};

type PageProps = { params: Promise<{ jobId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <JobViewPage jobId={params.jobId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
