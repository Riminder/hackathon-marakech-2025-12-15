import { fakeJobs, Job } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import JobFormTabs from './job-form-tabs';
import JobDetails from './job-details';

type TJobViewPageProps = {
  jobId: string;
};

export default async function JobViewPage({
  jobId
}: TJobViewPageProps) {
  let job = null;
  let pageTitle = 'Create New Job';

  if (jobId !== 'new' && jobId !== 'edit') {
    const data = await fakeJobs.getJobById(Number(jobId));
    job = data.job as Job;
    if (!job) {
      notFound();
    }
    return <JobDetails job={job} />;
  }

  if (jobId === 'new') {
    pageTitle = 'Create New Job';
  }

  return <JobFormTabs initialData={job} pageTitle={pageTitle} />;
}
