
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Moon, Sun, Home, Calendar, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'calendar' | 'status';
  onPageChange: (page: 'home' | 'calendar' | 'status') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', icon: Home, label: 'Daily Routine' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'status', icon: BarChart3, label: 'Progress' },
  ];

  return (
    <nav className="glass-morphism rounded-2xl p-4 mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(item.id as any)}
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:scale-110 transition-all duration-200"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
