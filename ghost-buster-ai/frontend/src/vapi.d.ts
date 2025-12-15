declare module '@vapi-ai/web' {
  interface VapiEventCallbacks {
    'call-start': () => void;
    'call-end': () => void;
    'speech-start': () => void;
    'speech-end': () => void;
    'volume-level': (volume: number) => void;
    'message': (message: VapiMessage) => void;
    'error': (error: Error) => void;
  }

  interface VapiMessage {
    type: 'transcript' | 'function-call' | 'hang' | 'speech-update' | 'metadata' | 'conversation-update';
    role?: 'user' | 'assistant';
    transcript?: string;
    transcriptType?: 'partial' | 'final';
  }

  interface AssistantOverrides {
    variableValues?: Record<string, string>;
    firstMessage?: string;
    recordingEnabled?: boolean;
  }

  class Vapi {
    constructor(publicKey: string);
    start(assistantId: string, overrides?: AssistantOverrides): Promise<void>;
    stop(): void;
    send(message: object): void;
    setMuted(muted: boolean): void;
    isMuted(): boolean;
    on<K extends keyof VapiEventCallbacks>(
      event: K,
      callback: VapiEventCallbacks[K]
    ): void;
    off<K extends keyof VapiEventCallbacks>(
      event: K,
      callback: VapiEventCallbacks[K]
    ): void;
  }

  export default Vapi;
}
