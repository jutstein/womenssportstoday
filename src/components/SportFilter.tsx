
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SportFilterProps = {
  sports: string[];
  selectedSport: string | null;
  onSelectSport: (sport: string | null) => void;
};

const SportFilter = ({ sports, selectedSport, onSelectSport }: SportFilterProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollLeft > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  return (
    <div className="relative w-full mt-24 mb-6">
      <div 
        className={cn(
          "overflow-x-auto scrollbar-hide flex gap-2 py-2 px-1",
          "transition-all duration-300 ease-in-out"
        )}
        onScroll={handleScroll}
      >
        <button
          className={cn(
            "flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
            "border border-border bg-white dark:bg-gray-900 shadow-sm",
            selectedSport === null 
              ? "bg-primary text-primary-foreground border-primary" 
              : "hover:bg-secondary/80"
          )}
          onClick={() => onSelectSport(null)}
        >
          All Sports
        </button>

        {sports.map((sport) => (
          <button
            key={sport}
            className={cn(
              "flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              "border border-border bg-white dark:bg-gray-900 shadow-sm",
              selectedSport === sport 
                ? "bg-primary text-primary-foreground border-primary" 
                : "hover:bg-secondary/80"
            )}
            onClick={() => onSelectSport(sport)}
          >
            {sport}
          </button>
        ))}
      </div>
      
      {isScrolled && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default SportFilter;
