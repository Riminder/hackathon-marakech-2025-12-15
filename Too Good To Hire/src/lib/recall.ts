import { RecallBot, RecallTranscript } from '@/types';

const RECALL_API_URL = 'https://api.recall.ai/api/v1';

class RecallAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RECALL_API_KEY || 'placeholder-recall-key';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${RECALL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Recall API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Create a bot for meeting recording
  async createBot(meetingUrl: string, botName: string = 'Hiring Agent Bot'): Promise<RecallBot> {
    const response = await this.request('/bot/', {
      method: 'POST',
      body: JSON.stringify({
        meeting_url: meetingUrl,
        bot_name: botName,
        automatic_leave: {
          waiting_room_timeout: 600, // 10 minutes
          noone_joined_timeout: 600, // 10 minutes
        },
        recording_config: {
          transcript: {
            provider: {
              deepgram_streaming: {
                model: 'nova-2',
                language: 'fr',
                smart_format: 'true',
                punctuate: 'true',
                diarize: 'true', // Speaker identification
              }
            }
          }
          // Note: No realtime_endpoints for hackathon simplicity
        },
      }),
    });

    return response;
  }

  // Get bot status
  async getBotStatus(botId: string): Promise<{ status: string; meeting_metadata?: any }> {
    const response = await this.request(`/bot/${botId}/`);
    return {
      status: response.status_changes?.[response.status_changes.length - 1]?.code || 'unknown',
      meeting_metadata: response.meeting_metadata
    };
  }

  // Get transcript (polling method)
  async getTranscript(botId: string): Promise<RecallTranscript | null> {
    try {
      const response = await this.request(`/bot/${botId}/transcript/`);
      
      if (!response.transcript || response.transcript.length === 0) {
        return null;
      }

      // Transform Recall transcript format to our format
      const segments = response.transcript.map((segment: any) => ({
        speaker: segment.speaker || 'Unknown',
        text: segment.words?.map((w: any) => w.text).join(' ') || segment.text || '',
        start_ms: segment.start_timestamp || 0,
        end_ms: segment.end_timestamp || 0,
        confidence: segment.confidence || 0.9
      }));

      return {
        id: response.id || botId,
        bot_id: botId,
        segments
      };
    } catch (error) {
      // Transcript might not be ready yet
      console.log(`Transcript not ready for bot ${botId}:`, error);
      return null;
    }
  }

  // Wait for transcript to be ready (with polling)
  async waitForTranscript(botId: string, maxAttempts: number = 30, intervalMs: number = 10000): Promise<RecallTranscript | null> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const transcript = await this.getTranscript(botId);
      
      if (transcript && transcript.segments.length > 0) {
        return transcript;
      }

      // Check if bot is still recording or completed
      const status = await this.getBotStatus(botId);
      
      if (status.status === 'done' || status.status === 'error') {
        // Bot finished, try one more time for transcript
        await new Promise(resolve => setTimeout(resolve, 5000));
        return await this.getTranscript(botId);
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    return null;
  }

  // Delete bot (cleanup)
  async deleteBot(botId: string): Promise<void> {
    await this.request(`/bot/${botId}/`, {
      method: 'DELETE'
    });
  }

  // Format transcript for display
  formatTranscriptForDisplay(transcript: RecallTranscript): string {
    return transcript.segments
      .map(segment => `**${segment.speaker}**: ${segment.text}`)
      .join('\n\n');
  }

  // Extract key moments from transcript
  extractKeyMoments(transcript: RecallTranscript): { speaker: string; text: string; timestamp: string }[] {
    // Simple extraction of longer segments (likely important moments)
    return transcript.segments
      .filter(segment => segment.text.length > 100) // Longer responses
      .map(segment => ({
        speaker: segment.speaker,
        text: segment.text,
        timestamp: this.formatTimestamp(segment.start_ms)
      }))
      .slice(0, 10); // Top 10 moments
  }

  private formatTimestamp(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const recall = new RecallAPI();