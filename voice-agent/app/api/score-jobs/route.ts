import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_BASE_URL || 'https://api.hrflow.ai/v1';
};

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await request.json();
    const boardKey = process.env.NEXT_PUBLIC_HRFLOW_BOARD_KEY;
    const sourceKey = process.env.NEXT_PUBLIC_HRFLOW_SOURCE_KEY;
    const apiKey = process.env.NEXT_PUBLIC_HRFLOW_API_KEY;

    if (!boardKey || !sourceKey || !apiKey) {
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `${getApiBaseUrl()}/profile/scoring`,
      {
        source_key: sourceKey,
        board_key: boardKey,
        profile_key: profileId,
        use_agent: true,
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
    console.error('Scoring error:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data || error.message || 'Scoring failed' },
      { status: 500 }
    );
  }
}