'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { useAnalytics } from '../hooks/useAnalytics';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function VedantAI() {
  const { trackEvent } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello watch-partner! I am VEDANT GPT, a virtual replica of Vedant Tiwari. I can explain my advertising experience, managed spends, programmatic setups, and recommend roles you can hire me for. How can I guide your exploration today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestions = [
    "What roles should I hire you for?",
    "Show me your ad spend metrics",
    "List your programmatic credentials",
    "Is there a secret Easter egg?"
  ];

  // Upgraded smart keyword parser for Vedant GPT
  const handleQuery = (query: string) => {
    if (!query.trim()) return;

    trackEvent('ai_query', { query });

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text: query, timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let answer = "";

      // 1. Role recommendations handler
      if (lowerQuery.includes('role') || lowerQuery.includes('hire') || lowerQuery.includes('job') || lowerQuery.includes('position')) {
        answer = "I recommend hiring me for: (1) Performance Marketing Specialist (managing ROAS acquisition funnels); (2) Digital Media Buyer & Planner (budget forecasting & omnichannel platforms allocation); (3) Marketing Technologist (building GTM pipelines, custom pixels, and Looker dashboards); or (4) Growth Marketer.";
      }
      // 2. Budget metrics handler
      else if (lowerQuery.includes('spend') || lowerQuery.includes('budget') || lowerQuery.includes('money') || lowerQuery.includes('metric')) {
        answer = "I have managed over ₹15L+ in cumulative advertising budgets across Meta Ads, Google PMax/Search, Amazon, and Programmatic DSP channels, delivering consistent increases in return on ad spend (ROAS) and reducing overall CPA by 22%.";
      }
      // 3. Programmatic credentials handler
      else if (lowerQuery.includes('credential') || lowerQuery.includes('certif') || lowerQuery.includes('programmatic') || lowerQuery.includes('dv360')) {
        answer = "I hold multiple verified credentials: Google Search Ads, Google Analytics 4 (GA4), Display & Video 360 (DV360), Campaign Manager 360 (CM360), Amazon DSP, and Reddit Ads Professional.";
      }
      // 4. Easter egg hint handler
      else if (lowerQuery.includes('secret') || lowerQuery.includes('easter') || lowerQuery.includes('egg') || lowerQuery.includes('bts')) {
        answer = "Aha! You want to access my Behind The Scenes logs? Try typing 'vedant' directly on your keyboard while browsing the website to unlock my personal hobbies, espresso coffee setup, and synthwave music playlists!";
      }
      // 5. Default search parser scan in aiKnowledge database
      else {
        let highestMatchCount = 0;
        portfolioData.aiKnowledge.forEach((item) => {
          item.questionKeywords.forEach((keywordsGroup) => {
            let matchCount = 0;
            keywordsGroup.forEach((keyword) => {
              if (lowerQuery.includes(keyword)) matchCount++;
            });
            if (matchCount > highestMatchCount && matchCount >= keywordsGroup.length - 1) {
              highestMatchCount = matchCount;
              answer = item.answer;
            }
          });
        });
      }

      // Fallback
      if (!answer) {
        answer = "I couldn't locate specific diagnostic logs for that question. However, I can confirm I am a Mumbai-based growth marketer specializing in ROAS scaling, media plans, and tag pipelines. Try asking about my spend managed, certifications, or recommended roles!";
      }

      const aiMsg: Message = { sender: 'ai', text: answer, timestamp };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          className="w-14 h-14 bg-[#E50914] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-red-700 focus:outline-none cursor-pointer glow-box-red border border-red-500/30"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] rounded-xl bg-[#141414] border border-neutral-800 shadow-2xl flex flex-col overflow-hidden z-40 glass-panel"
          >
            {/* Chat Header */}
            <div className="bg-[#181818] border-b border-neutral-900 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-red-950/60 border border-red-800/40 flex items-center justify-center text-[#E50914]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-extrabold flex items-center gap-1.5 font-sans">
                    VEDANT GPT
                    <span className="text-[9px] font-bold text-[#E50914] border border-[#E50914]/40 px-1 rounded uppercase">Agent</span>
                  </h3>
                  <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    Online System
                  </span>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="text-neutral-500 hover:text-neutral-300 cursor-pointer focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-2.5 ${!isAI ? 'justify-end' : ''}`}
                  >
                    {isAI && (
                      <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs shrink-0 text-red-500 font-bold select-none">
                        V
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-1 max-w-[80%]">
                      <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                        isAI 
                          ? 'bg-neutral-900/80 text-neutral-200 border border-neutral-800/40' 
                          : 'bg-[#E50914] text-white shadow-md'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-neutral-600 ${!isAI ? 'text-right' : ''}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isAI && (
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs shrink-0 text-white font-bold select-none">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs shrink-0 text-red-500 font-bold select-none">
                    V
                  </div>
                  <div className="bg-neutral-900/80 text-neutral-200 border border-neutral-800/40 p-3.5 rounded-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>

            {/* Suggestions Chips */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 border-t border-neutral-900 space-y-1.5 bg-neutral-950/20">
                <span className="text-[10px] text-neutral-600 block font-bold uppercase tracking-wider mb-1">Suggested prompts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleQuery(s)}
                      className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] text-neutral-400 hover:text-white rounded border border-neutral-800/50 cursor-pointer select-none text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-neutral-900 bg-[#181818] flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery(inputValue)}
                placeholder="Ask VEDANT GPT..."
                className="flex-1 bg-neutral-950 border border-neutral-900 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914] placeholder-neutral-600"
              />
              <button
                onClick={() => handleQuery(inputValue)}
                className="p-2 bg-[#E50914] hover:bg-red-700 text-white rounded cursor-pointer active:scale-95 transition-all focus:outline-none shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
