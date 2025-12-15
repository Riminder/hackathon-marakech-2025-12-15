import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, X, Mic, MessageSquare } from 'lucide-react';
import type { ChatContext } from '../lib/types';
import { useVapi } from '../hooks/useVapi';
import { VoiceMode } from './VoiceMode';

interface ChatProps {
  context: ChatContext;
  onClose: () => void;
}

type ChatMode = 'text' | 'voice';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Chat({ context, onClose }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ChatMode>('text');
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${context.candidateName}! I'm here to help you understand your application feedback for the ${context.jobTitle} position. Feel free to ask me about:\n\n• Your skill gaps and how to address them\n• Learning resources and recommendations\n• Other roles that might be a better fit\n• Any questions about the position\n\nHow can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice transcript handler
  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    setTranscript(text);
    if (isFinal && text.trim()) {
      // Add final user transcript to messages
      setMessages(prev => [...prev, {
        id: `user-voice-${Date.now()}`,
        role: 'user',
        content: text,
      }]);
      setTranscript('');
    }
  }, []);

  const {
    status: vapiStatus,
    isMuted,
    volumeLevel,
    startCall,
    stopCall,
    toggleMute,
    isConfigured: isVapiConfigured,
  } = useVapi({
    context,
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context,
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Parse the streaming format: 0:"text"\n
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.slice(2));
              assistantContent += text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            } catch {
              // Skip malformed lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Career Feedback Chat</h2>
            <p className="text-blue-100 text-xs">
              {mode === 'text' ? 'Text mode' : 'Voice mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle buttons */}
          {isVapiConfigured && (
            <div className="flex bg-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setMode('text')}
                className={`p-1.5 rounded-md transition-colors ${
                  mode === 'text' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
                title="Text chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMode('voice')}
                className={`p-1.5 rounded-md transition-colors ${
                  mode === 'voice' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
                title="Voice chat"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Content area - either text messages or voice mode */}
      {mode === 'text' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${message.role === 'user'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-indigo-100 text-indigo-600'
                    }
                  `}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-3
                    ${message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your feedback..."
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">
              Powered by AI
            </p>
          </form>
        </>
      ) : (
        <VoiceMode
          status={vapiStatus}
          isMuted={isMuted}
          volumeLevel={volumeLevel}
          onStartCall={startCall}
          onStopCall={stopCall}
          onToggleMute={toggleMute}
          transcript={transcript}
        />
      )}
    </div>
  );
}
