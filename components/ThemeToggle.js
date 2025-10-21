"use client";
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      style={{
        backgroundColor: theme === 'dark' ? '#333333' : '#c5c5c5',
        transition: 'background-color 0.3s ease'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 transform ${
          isAnimating ? 'scale-110' : 'scale-100'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? '#fafafa' : '#4f4f4f',
          transform: theme === 'dark' 
            ? 'translateX(24px) translateY(0)' 
            : 'translateX(2px) translateY(0)',
          boxShadow: theme === 'dark' 
            ? '0 2px 4px rgba(0,0,0,0.2)' 
            : '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <div
          className={`transition-opacity duration-300 ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontSize: '10px', color: '#4f4f4f' }}
        >
          ☀️
        </div>
        
        <div
          className={`transition-opacity duration-300 ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontSize: '10px', color: '#fafafa' }}
        >
          🌙
        </div>
      </div>
    </button>
  );
}

