
import { useState, useEffect } from 'react';
import { Calendar } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out py-4 px-6 md:px-8 
      ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 glass-panel shadow-sm' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              womenssportsoftoday
            </span>
          </h1>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
            <span>{currentDate}</span>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
