
import { Clock, MapPin, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { Game } from "@/utils/sportsData";

interface GameCardProps {
  game: Game;
  index: number;
}

const GameCard = ({ game, index }: GameCardProps) => {
  const isLive = game.status === 'Live';
  const startingSoon = game.status === 'Starting Soon';
  
  return (
    <div 
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-300",
        "shadow-sm hover:shadow-md border border-border",
        "animate-fade-up",
      )}
      style={{ animationDelay: `${100 * (index % 10)}ms` }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="inline-flex items-center">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {game.sport}
              </span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {game.league}
              </span>
            </div>

            <h3 className="mt-2 text-lg font-semibold">{game.teams.home} vs {game.teams.away}</h3>
          </div>

          {isLive && (
            <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow"></div>
              <span className="text-xs font-medium text-red-700 dark:text-red-400">LIVE</span>
            </div>
          )}
          
          {startingSoon && (
            <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Starting Soon</span>
            </div>
          )}
          
          {!isLive && !startingSoon && (
            <div className="text-sm font-medium text-muted-foreground">
              {game.time}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{game.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{game.venue}</span>
          </div>
          
          {game.broadcast && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tv className="h-4 w-4" />
              <span>{game.broadcast}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default GameCard;
