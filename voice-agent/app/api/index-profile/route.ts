import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_BASE_URL || 'https://api.hrflow.ai/v1';
};

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json();
    const sourceKey = process.env.NEXT_PUBLIC_HRFLOW_SOURCE_KEY;
    const apiKey = process.env.NEXT_PUBLIC_HRFLOW_API_KEY;

    if (!sourceKey || !apiKey) {
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `${getApiBaseUrl()}/profile/indexing`,
      {
        source_key: sourceKey,
        profile: profile,
      },
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Indexing error:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data || error.message || 'Indexing failed' },
      { status: 500 }
    );
  }
}