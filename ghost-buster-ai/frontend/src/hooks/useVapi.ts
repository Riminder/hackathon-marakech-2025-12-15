import { useState, useEffect, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import type { ChatContext } from '../lib/types';

export type VapiStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error';

interface UseVapiOptions {
  context: ChatContext;
  onTranscript?: (text: string, isFinal: boolean) => void;
}

export function useVapi({ context, onTranscript }: UseVapiOptions) {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<VapiStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Check if VAPI is configured
  const isConfigured = Boolean(
    import.meta.env.VITE_VAPI_PUBLIC_KEY &&
    import.meta.env.VITE_VAPI_ASSISTANT_ID
  );

  // Initialize Vapi instance
  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      return;
    }

    vapiRef.current = new Vapi(publicKey);
    const vapi = vapiRef.current;

    // Event listeners
    vapi.on('call-start', () => {
      setStatus('connected');
    });

    vapi.on('call-end', () => {
      setStatus('idle');
      setVolumeLevel(0);
    });

    vapi.on('speech-start', () => {
      setStatus('speaking');
    });

    vapi.on('speech-end', () => {
      setStatus('listening');
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on('error', (error: Error) => {
      console.error('VAPI error:', error);
      setStatus('error');
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcript) {
        const isFinal = message.transcriptType === 'final';
        onTranscript?.(message.transcript, isFinal);
      }
    });

    return () => {
      vapi.stop();
    };
  }, [onTranscript]);

  // Build variable values for assistant overrides
  const buildVariableValues = useCallback(() => {
    const { candidateName, jobTitle, skillGaps, strengths, recommendations } = context;

    const skillGapsText = skillGaps.length > 0
      ? skillGaps.map(gap =>
          `${gap.name}: Candidate level ${gap.candidateLevel}%, Required ${gap.requiredLevel}%`
        ).join('. ')
      : 'No significant gaps identified.';

    const strengthsText = strengths.length > 0
      ? strengths.map(s =>
          `${s.name}: Candidate level ${s.candidateLevel}% exceeds required ${s.requiredLevel}%`
        ).join('. ')
      : 'Analysis pending.';

    const recommendationsText = recommendations.length > 0
      ? recommendations.join('. ')
      : 'No specific recommendations yet.';

    return {
      candidateName,
      jobTitle,
      skillGapsText,
      strengthsText,
      recommendationsText,
    };
  }, [context]);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) return;

    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      console.error('VAPI assistant ID not configured');
      setStatus('error');
      return;
    }

    setStatus('connecting');

    try {
      await vapiRef.current.start(assistantId, {
        variableValues: buildVariableValues(),
      });
    } catch (error) {
      console.error('Failed to start VAPI call:', error);
      setStatus('error');
    }
  }, [buildVariableValues]);

  const stopCall = useCallback(() => {
    vapiRef.current?.stop();
    setStatus('idle');
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      vapiRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  return {
    status,
    isMuted,
    volumeLevel,
    startCall,
    stopCall,
    toggleMute,
    isConfigured,
  };
}
