import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_BASE_URL || 'https://api.hrflow.ai/v1';
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;
    const sourceKey = process.env.NEXT_PUBLIC_HRFLOW_SOURCE_KEY;
    const apiKey = process.env.NEXT_PUBLIC_HRFLOW_API_KEY;

    if (!sourceKey || !apiKey) {
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    let response;

    if (file) {
      // Parse file (PDF or JPEG)
      const fileFormData = new FormData();
      fileFormData.append('file', file);
      fileFormData.append('source_key', sourceKey);

      response = await axios.post(
        `${getApiBaseUrl()}/profile/parsing/file`,
        fileFormData,
        {
          headers: {
            'X-API-KEY': apiKey,
          },
        }
      );
    } else if (text) {
      // Parse text
      response = await axios.post(
        `${getApiBaseUrl()}/profile/parsing/text`,
        {
          source_key: sourceKey,
          text: text,
        },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      return NextResponse.json(
        { error: 'No file or text provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Parsing error:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data || error.message || 'Parsing failed' },
      { status: 500 }
    );
  }
}