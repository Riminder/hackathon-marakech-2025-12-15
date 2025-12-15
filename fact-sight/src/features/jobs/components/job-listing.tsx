import { Job } from '@/constants/data';
import { fakeJobs } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { JobTable } from './job-tables';
import { columns } from './job-tables/columns';

type JobListingPage = {};

export default async function JobListingPage({}: JobListingPage) {
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

  const data = await fakeJobs.getJobs(filters);
  const totalJobs = data.total_jobs;
  const jobs: Job[] = data.jobs;

  return (
    <JobTable
      data={jobs}
      totalItems={totalJobs}
      columns={columns}
    />
  );
}
