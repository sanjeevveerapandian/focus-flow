
import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import HomePage from '../components/HomePage';
import CalendarPage from '../components/CalendarPage';
import StatusPage from '../components/StatusPage';

type PageType = 'home' | 'calendar' | 'status';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'status':
        return <StatusPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Navigation 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
          
          <main className="relative">
            {renderCurrentPage()}
          </main>
          
          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>Stay consistent, achieve greatness! 🚀</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
