"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react'

interface ThemeToggleProps {
  variant?: 'compact' | 'dropdown';
  mode?: 'compact' | 'dropdown';
  className?: string;
}

export function ThemeToggle({ variant, mode, className = '' }: ThemeToggleProps) {
  const effectiveVariant = variant || mode || 'dropdown';
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick toggle between light and dark for compact mode
  const handleQuickToggle = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const options = [
    { key: 'light' as const, label: 'Light', icon: Sun },
    { key: 'dark' as const, label: 'Dark', icon: Moon },
    { key: 'system' as const, label: 'System', icon: Laptop }
  ];

  if (effectiveVariant === 'compact') {
    return (
      <button
        onClick={handleQuickToggle}
        className={`p-2 rounded-lg border transition-all text-xs font-mono flex items-center justify-center ${
          resolvedTheme === 'dark'
            ? 'bg-slate-800/80 border-slate-700 text-amber-300 hover:text-amber-200 hover:bg-slate-700'
            : 'bg-slate-100 border-slate-300 text-blue-600 hover:text-blue-700 hover:bg-slate-200'
        } ${className}`}
        title={`Current: ${theme.toUpperCase()} (${resolvedTheme} mode). Click to toggle.`}
        aria-label="Toggle Light/Dark Theme"
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </button>
    );
  }

  const ActiveIcon = theme === 'system' ? Laptop : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-mono hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-200 transition-all shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Change Appearance Theme"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-blue-400 dark:text-blue-400 light:text-blue-600" />
        <span className="capitalize">{theme}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-2xl bg-[#0f172a] dark:bg-[#0f172a] light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200 z-50 p-1.5 text-xs font-mono space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500 border-b border-slate-800 dark:border-slate-800 light:border-slate-100 mb-1">
            Appearance
          </div>

          {options.map(opt => {
            const Icon = opt.icon;
            const isSelected = theme === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setTheme(opt.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-400 dark:text-blue-400 light:text-blue-600 font-bold'
                    : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
