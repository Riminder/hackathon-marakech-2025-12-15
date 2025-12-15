'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Job } from '@/constants/mock-api';
import { IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function JobFormTabs({
  pageTitle
}: {
  initialData: Job | null;
  pageTitle: string;
}) {
  const [rawText, setRawText] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');

  const handleAnalyzeNew = () => {
    // Handle new request analysis
    console.log('Analyzing raw text:', rawText);
  };

  const handleAnalyzePast = () => {
    // Handle past request analysis
    console.log('Analyzing past query:', selectedQuery);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='new' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='new'>New Request</TabsTrigger>
            <TabsTrigger value='past'>Past Requests</TabsTrigger>
          </TabsList>

          <TabsContent value='new' className='space-y-4 pt-6'>
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Enter a raw text
              </label>
              <Textarea
                placeholder='We are looking for a software engineer focused on results to join...'
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className='min-h-[400px] resize-none'
              />
            </div>

            <div className='flex justify-end'>
              <Button
                onClick={handleAnalyzeNew}
                size='lg'
                className='gap-2'
              >
                Analyze and Continue
                <IconArrowRight className='h-4 w-4' />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='past' className='space-y-4 pt-6'>
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Select or search query by title
              </label>
              <Select value={selectedQuery} onValueChange={setSelectedQuery}>
                <SelectTrigger className='h-12'>
                  <SelectValue placeholder='Select or search query by title...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='query1'>Software Engineer - Full Stack</SelectItem>
                  <SelectItem value='query2'>Senior Product Manager</SelectItem>
                  <SelectItem value='query3'>Data Scientist - ML</SelectItem>
                  <SelectItem value='query4'>UX Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex justify-end'>
              <Button
                onClick={handleAnalyzePast}
                size='lg'
                className='gap-2'
              >
                Analyze and Continue
                <IconArrowRight className='h-4 w-4' />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
