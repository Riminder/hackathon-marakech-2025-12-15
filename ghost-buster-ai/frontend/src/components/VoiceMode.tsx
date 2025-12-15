import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from 'lucide-react';
import type { VapiStatus } from '../hooks/useVapi';

interface VoiceModeProps {
  status: VapiStatus;
  isMuted: boolean;
  volumeLevel: number;
  onStartCall: () => void;
  onStopCall: () => void;
  onToggleMute: () => void;
  transcript?: string;
}

export function VoiceMode({
  status,
  isMuted,
  volumeLevel,
  onStartCall,
  onStopCall,
  onToggleMute,
  transcript,
}: VoiceModeProps) {
  const isActive = status === 'connected' || status === 'speaking' || status === 'listening';

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
      {/* Status indicator */}
      <div className="mb-6 text-center">
        <div className={`
          w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all
          ${status === 'idle' ? 'bg-gray-100' : ''}
          ${status === 'connecting' ? 'bg-blue-100 animate-pulse' : ''}
          ${status === 'connected' || status === 'listening' ? 'bg-green-100' : ''}
          ${status === 'speaking' ? 'bg-indigo-100' : ''}
          ${status === 'error' ? 'bg-red-100' : ''}
        `}>
          {status === 'connecting' && <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />}
          {status === 'listening' && <Mic className="w-10 h-10 text-green-600" />}
          {status === 'speaking' && <Volume2 className="w-10 h-10 text-indigo-600" />}
          {(status === 'idle' || status === 'connected') && <Phone className="w-10 h-10 text-gray-400" />}
          {status === 'error' && <PhoneOff className="w-10 h-10 text-red-600" />}
        </div>

        <p className="text-sm font-medium text-gray-700">
          {status === 'idle' && 'Tap to start voice chat'}
          {status === 'connecting' && 'Connecting...'}
          {status === 'connected' && 'Connected'}
          {status === 'listening' && 'Listening...'}
          {status === 'speaking' && 'Assistant speaking...'}
          {status === 'error' && 'Connection error'}
        </p>
      </div>

      {/* Volume indicator when active */}
      {isActive && (
        <div className="w-full max-w-xs mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-100"
              style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Live transcript */}
      {transcript && isActive && (
        <div className="w-full max-w-sm mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 italic text-center">{transcript}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {status === 'idle' || status === 'error' ? (
          <button
            onClick={onStartCall}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Start Voice Chat
          </button>
        ) : status === 'connecting' ? (
          <div className="text-gray-500 text-sm">Connecting...</div>
        ) : (
          <>
            <button
              onClick={onToggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={onStopCall}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
              End Call
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
        Voice chat uses your microphone. Speak naturally and the AI will respond.
      </p>
    </div>
  );
}
