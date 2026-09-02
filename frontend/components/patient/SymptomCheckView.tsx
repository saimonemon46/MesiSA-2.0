"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, TriageMessage } from '../../lib/types';
import { api } from '../../lib/api';
import {
  MessageSquareHeart,
  Send,
  AlertTriangle,
  PhoneCall,
  Sparkles,
  Bot,
  User as UserIcon,
  CheckCircle2,
  Info
} from '../Icons';

interface SymptomCheckViewProps {
  user: User;
  onViewReport?: (reportId: number) => void;
}

export const SymptomCheckView: React.FC<SymptomCheckViewProps> = ({ user, onViewReport }) => {
  const [messages, setMessages] = useState<TriageMessage[]>([
    {
      sender_role: 'ai',
      message: `Hello ${user.name}, I am MediSA AI clinical triage assistant. Please describe your main symptoms, how long you have had them, and how severe they feel.`,
      created_at: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 12));
  const [redFlagAlert, setRedFlagAlert] = useState<{ active: boolean; summary?: string } | null>(null);
  const [contradictionAlert, setContradictionAlert] = useState<string | null>(null);
  const [completedOutcome, setCompletedOutcome] = useState<{ summary?: string; riskLevel?: string; recommendations?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || redFlagAlert?.active) return;

    const userText = input.trim();
    setInput('');
    setContradictionAlert(null);

    const userMsg: TriageMessage = {
      sender_role: 'patient',
      message: userText,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await api.ai.sendTriageStep(
        sessionToken,
        user.id,
        userText,
        newMessages.map(m => ({ role: m.sender_role, content: m.message })),
        user.patient_profile
      );

      // Rule 12: Emergency Red Flag Triggered
      if (response.red_flag_detected) {
        setRedFlagAlert({
          active: true,
          summary: response.ai_summary || 'Emergency medical danger indicators detected.'
        });
        setMessages(prev => [
          ...prev,
          {
            sender_role: 'ai',
            message: 'CRITICAL ALERT: Your symptoms suggest an acute emergency. Please contact emergency services (911/999) or visit the nearest emergency room immediately.',
            created_at: 'Just now'
          }
        ]);
        setIsLoading(false);
        return;
      }

      // Rule 13: Contradiction Clarification Triggered
      if (response.contradiction_detected && response.reply) {
        setContradictionAlert(response.reply);
        setMessages(prev => [
          ...prev,
          {
            sender_role: 'ai',
            message: response.reply,
            created_at: 'Just now'
          }
        ]);
        setIsLoading(false);
        return;
      }

      // Completion Signal
      if (response.is_completed) {
        setCompletedOutcome({
          summary: response.ai_summary,
          riskLevel: response.risk_level,
          recommendations: response.recommended_action
        });
        setMessages(prev => [
          ...prev,
          {
            sender_role: 'ai',
            message: `Triage Complete. Summary: ${response.ai_summary} \\n\\nRecommended Action: ${response.recommended_action}`,
            created_at: 'Just now'
          }
        ]);
        setIsLoading(false);
        return;
      }

      // Normal follow-up question
      if (response.reply) {
        setMessages(prev => [
          ...prev,
          {
            sender_role: 'ai',
            message: response.reply,
            created_at: 'Just now'
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender_role: 'ai',
          message: 'Could you describe if the symptoms are constant or intermittent?',
          created_at: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRedFlag = () => {
    setInput('I have severe crushing chest pain radiating to my left arm and jaw.');
  };

  const handleTestContradiction = () => {
    setInput('I have no medical history or previous conditions at all.');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              AI Clinical Triage Assistant
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Active Guardian
              </span>
            </h2>
            <p className="text-xs text-slate-400">LangGraph Reasoning Machine with Emergency Red Flag Interceptor</p>
          </div>
        </div>

        {/* Quick test triggers */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={handleTestRedFlag}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800/80 hover:bg-rose-900 transition flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Test Red Flag (Rule 12)
          </button>
          <button
            onClick={handleTestContradiction}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/80 hover:bg-amber-900 transition flex items-center gap-1"
          >
            <Info className="w-3 h-3 text-amber-400" /> Test Contradiction (Rule 13)
          </button>
        </div>
      </div>

      {/* Emergency Red-Flag Banner (Rule 12) */}
      {redFlagAlert?.active && (
        <div className="glass-card-emergency p-5 rounded-2xl text-white space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-600 text-white animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-200">EMERGENCY PROTOCOL ACTIVATED</h3>
              <p className="text-xs text-rose-100/90">{redFlagAlert.summary}</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 leading-relaxed">
            Per Clinical Safety Rule 12, conversational questioning has been immediately terminated. Seek immediate emergency medical care without delay.
          </div>
          <div className="flex gap-3">
            <a
              href="tel:911"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white flex items-center gap-2 shadow-lg shadow-rose-600/40 transition"
            >
              <PhoneCall className="w-4 h-4" /> Call 911 Immediately
            </a>
          </div>
        </div>
      )}

      {/* Contradiction Alert Banner (Rule 13) */}
      {contradictionAlert && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 animate-fade-in">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Clinical Clarification Required (Rule 13): </span>
            <span>{contradictionAlert}</span>
          </div>
        </div>
      )}

      {/* Completed Outcome Card */}
      {completedOutcome && (
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/40 bg-gradient-to-r from-slate-900 to-emerald-950/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Triage Assessment Completed
            </div>
            <span
              className={`text-xs uppercase font-bold px-2.5 py-1 rounded-full ${
                completedOutcome.riskLevel === 'high'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              {completedOutcome.riskLevel} Risk
            </span>
          </div>
          <p className="text-xs text-slate-200">{completedOutcome.summary}</p>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-sky-400">Recommended Action: </span>
            {completedOutcome.recommendations}
          </div>
        </div>
      )}

      {/* Chat Messages Box */}
      <div className="glass-panel p-5 rounded-2xl min-h-[380px] max-h-[480px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isAI = m.sender_role === 'ai';
          return (
            <div key={idx} className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isAI
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm'
                    : 'bg-sky-600 text-white font-medium shadow-md shadow-sky-600/20'
                }`}
              >
                <div className="whitespace-pre-line">{m.message}</div>
                <div className={`text-[10px] mt-1.5 ${isAI ? 'text-slate-500' : 'text-sky-200'} text-right`}>
                  {m.created_at || 'Just now'}
                </div>
              </div>
              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || redFlagAlert?.active}
          placeholder={redFlagAlert?.active ? 'Triage stopped due to medical emergency' : 'Type your symptoms or answer the AI question...'}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || redFlagAlert?.active}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-sky-500/20 transition"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
