import React from 'react';
import { BookOpen, Target, MessageSquare, BookMarked, BarChart3, Flame, Settings, History, Brain, Sparkles } from 'lucide-react';
import type { PracticeMode } from '../types';

interface NavbarProps {
  activeTab: PracticeMode | 'words' | 'stats' | 'history';
  setActiveTab: (tab: any) => void;
  streak?: number;
  streakCount?: number;
  totalMinutes?: number;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streak = 0,
  streakCount,
  onOpenSettings
}) => {
  const displayStreak = streakCount !== undefined ? streakCount : streak;
  const navItems = [
    { id: 'story', label: 'Story Coach', icon: BookOpen },
    { id: 'interview', label: 'STAR Interview', icon: Target },
    { id: 'cognitive', label: 'Cognitive Lab', icon: Brain },
    { id: 'free', label: 'Free Talk', icon: MessageSquare },
    { id: 'words', label: '10 Words', icon: BookMarked },
    { id: 'history', label: 'Voice History', icon: History },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-4 z-50 w-full max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6 mb-6">
      <div className="glass-container rounded-full p-2.5 sm:px-6 flex items-center justify-between shadow-xl border border-white/95 backdrop-blur-2xl">
        {/* Brand Logo - Robot Assistant Avatar */}
        <div 
          onClick={() => setActiveTab('story')} 
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center p-1 border border-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
            <img src="/robot_assistant.svg" alt="Talk-a-Tron Robot Assistant" className="w-7 h-7 object-contain" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-ping" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans flex items-center gap-1.5">
            Talk-a-Tron
            <span className="text-[10px] font-extrabold text-slate-800 bg-slate-200/90 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-2xs group-hover:bg-slate-300 transition">
              AI Bot
            </span>
          </span>
        </div>

        {/* Floating Glass Pill Navigation Bar - Animated Switcher */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-white/70 backdrop-blur-lg border border-white/90 shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? 'glass-pill-active shadow-lg scale-[1.03] text-white'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/90 hover:scale-[1.02] hover:shadow-xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Animated Daily Streak Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-xs hover:scale-105 transition cursor-default">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{displayStreak} Day</span>
          </div>

          {/* Animated Dark Action Pill Button */}
          <button
            onClick={() => setActiveTab('free')}
            className="btn-dark px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
            <span>Get Started</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full border border-slate-300/90 bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white hover:rotate-45 hover:scale-110 active:scale-90 transition-all duration-300 shadow-xs"
            title="Voice & AI Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Glass Bar Navigation */}
      <div className="md:hidden flex items-center justify-around mt-2 p-1.5 rounded-full glass-pill overflow-x-auto shadow-md">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center px-2.5 py-1 text-[10px] font-semibold transition-all ${
                isActive ? 'text-slate-900 font-extrabold scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 mb-0.5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
              <span className="truncate max-w-[65px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
