'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import styles from './ChatBot.module.css';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
};

const SUGGESTIONS = [
  "How is my risk score calculated?",
  "What do my recommendations mean?",
  "How can I improve my cognitive health?",
  "What is the difference between the 3 tests?"
];

// Simulated AI logic
function generateResponse(query: string, riskLevel: string | null, score: number | null): string {
  const q = query.toLowerCase();
  
  if (q.includes('score') || q.includes('calculated')) {
    if (score !== null) {
      return `Your current score is ${score}/100. It is a weighted composite of your speech fluency, facial engagement, and memory recall. A score above 75 is considered healthy, while lower scores may indicate areas for monitoring.`;
    }
    return "Your risk score is calculated by combining the results of the Speech, Facial, and Cognitive recall modules. You need to complete all tests first!";
  }
  
  if (q.includes('recommendation') || q.includes('improve') || q.includes('mean')) {
    if (riskLevel === 'High') {
      return "Based on your elevated risk profile, the most critical recommendation is to consult a neurologist and begin formal monitoring. We also suggest intensive brain training and notifying a caregiver.";
    } else if (riskLevel === 'Medium') {
      return "For a medium risk profile, we strongly recommend structured brain training, improving your sleep habits, and scheduling a check-in with your primary care physician to rule out treatable causes.";
    } else if (riskLevel === 'Low') {
      return "You have a healthy profile! The best way to maintain it is through daily aerobic exercise, a Mediterranean diet, and consistent 7-9 hours of sleep.";
    }
    return "Once you complete the assessment, I can give you personalized recommendations. Generally, exercise, good sleep, and social engagement are great for the brain!";
  }
  
  if (q.includes('test') || q.includes('modules') || q.includes('difference')) {
    return "We use 3 multimodal tests: 1) Speech Analysis tracks fluency. 2) Facial Analysis maps 68 landmarks to detect micro-expressions. 3) Cognitive Test measures short-term memory recall.";
  }

  if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
    return "Hello! I am Cogniscan AI, your clinical assistant. How can I help you understand your cognitive health today?";
  }

  return "I'm a simulated assistant for Cogniscan AI. I can explain your risk scores, detail your recommendations, or clarify how our 3-part assessment works. What would you like to know?";
}


export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hi there! I am your Cogniscan AI clinical assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { riskLevel, finalScore } = useAssessment();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);
    
    // Simulate network delay
    setTimeout(() => {
      const responseText = generateResponse(text, riskLevel, finalScore);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.chatPanel}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerIcon}>🤖</div>
              <div>
                <div className={styles.headerTitle}>Cogniscan Assistant</div>
                <div className={styles.headerStatus}>
                  <div className={styles.headerStatusDot} />
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.messageUser : styles.messageAi}`}
                >
                  <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                    {msg.text}
                  </div>
                  <div className={styles.messageTime}>{msg.time}</div>
                </div>
              ))}
              
              {isTyping && (
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                </div>
              )}

              {messages.length === 1 && !isTyping && (
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s)} className={styles.suggestionBadge}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputMsg)}
                placeholder="Ask a medical question..."
                className={styles.inputField}
              />
              <button
                onClick={() => handleSend(inputMsg)}
                disabled={!inputMsg.trim() || isTyping}
                className={styles.sendBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleBtn}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}
