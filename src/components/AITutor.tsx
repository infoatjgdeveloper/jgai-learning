import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { askClaude, AIMessage } from '../lib/ai';

interface AITutorProps {
  courseTitle: string;
  lessonContent?: string;
}

export function AITutor({ courseTitle, lessonContent }: AITutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hey! I'm your JGAI tutor. I'm here to help you with "${courseTitle}". Ask me anything.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);

    try {
      const history: AIMessage[] = nextMessages
        .slice(1)
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

      const text = await askClaude({
        system: `You are the JGAI tutor on JGAI Learning, an AI university platform.
The student is studying: "${courseTitle}".
${lessonContent ? `Current lesson content: "${lessonContent}"` : ''}
Be clear, encouraging and concise. Explain step by step when helpful.`,
        messages: history
      });

      setMessages((prev) => [...prev, { role: 'model', text, timestamp: new Date().toISOString() }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-jgai text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Open JGAI tutor"
      >
        <Sparkles size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-96 max-h-[600px] h-[70vh] bg-panel rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border border-edge sans"
          >
            <div className="bg-panel-2 border-b border-edge p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold tracking-tight">JGAI Tutor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-panel/20 p-1 rounded-full transition-colors" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-void/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-jgai text-white rounded-tr-none'
                        : 'bg-panel text-snow shadow-sm border border-edge rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-panel p-3 rounded-2xl rounded-tl-none shadow-sm border border-edge">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-edge bg-panel">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your JGAI tutor..."
                  className="flex-grow bg-panel-2 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-jgai transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-jgai text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
