export interface Game {
  id: string;
  sport: string;
  league: string;
  teams: {
    home: string;
    away: string;
    homeScore?: number;
    awayScore?: number;
  };
  time: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Starting Soon';
  venue: string;
  broadcast?: string;
}

// Import our new scraper service
import { scrapeGames } from '@/services/sportsScraper';

// Main function to fetch today's games
export const fetchTodaysGames = async (): Promise<Game[]> => {
  try {
    console.log('Fetching today\'s games...');
    
    // Use our scraper service to get game data
    const games = await scrapeGames();
    
    // Return the scraped games, which will be properly formatted
    return games;
  } catch (error) {
    console.error('Error fetching games data:', error);
    // Fallback to mock data if scraping fails
    return MOCK_GAMES;
  }
};

// This function is no longer needed as we've replaced it with the scraper
// Keeping it here for backward compatibility
export const fetchNWSLGames = async (): Promise<Game[]> => {
  try {
    // This now just returns the NWSL games from our mock data
    // as a fallback in case the scraper fails
    return MOCK_GAMES.filter(game => game.league === 'NWSL');
  } catch (error) {
    console.error('Error fetching NWSL games:', error);
    return MOCK_GAMES.filter(game => game.league === 'NWSL');
  }
};

// Get unique sports from the games data
export const getUniqueSports = (games: Game[]): string[] => {
  return [...new Set(games.map(game => game.sport))];
};

// User-specific watchlist functions
export const saveWatchlist = (watchlist: string[], userId: string): void => {
  // Use a consistent key format with the user ID
  const key = `sports-watchlist-${userId}`;
  localStorage.setItem(key, JSON.stringify(watchlist));
};

export const loadWatchlist = (userId: string | null): string[] => {
  if (!userId) return [];
  
  // Use the same key format as in saveWatchlist
  const key = `sports-watchlist-${userId}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

// Mock data as fallback for when scraping fails
const MOCK_GAMES: Game[] = [
  {
    id: '1',
    sport: 'Basketball',
    league: 'WNBA',
    teams: {
      home: 'Las Vegas Aces',
      away: 'Seattle Storm',
    },
    time: '7:00 PM ET',
    status: 'Scheduled',
    venue: 'Michelob ULTRA Arena, Las Vegas',
    broadcast: 'ESPN',
  },
  {
    id: '2',
    sport: 'Basketball',
    league: 'WNBA',
    teams: {
      home: 'Connecticut Sun',
      away: 'Washington Mystics',
      homeScore: 65,
      awayScore: 58,
    },
    time: '2:30 PM ET',
    status: 'Live',
    venue: 'Mohegan Sun Arena, CT',
    broadcast: 'CBS Sports Network',
  },
  {
    id: '3',
    sport: 'Soccer',
    league: 'NWSL',
    teams: {
      home: 'Portland Thorns FC',
      away: 'OL Reign',
    },
    time: '5:00 PM ET',
    status: 'Starting Soon',
    venue: 'Providence Park, Portland',
    broadcast: 'Paramount+',
  },
  {
    id: '4',
    sport: 'Soccer',
    league: 'NWSL',
    teams: {
      home: 'North Carolina Courage',
      away: 'Chicago Red Stars',
    },
    time: '8:00 PM ET',
    status: 'Scheduled',
    venue: 'WakeMed Soccer Park, Cary',
    broadcast: 'Paramount+',
  },
  {
    id: '5',
    sport: 'Volleyball',
    league: 'Pro Volleyball Federation',
    teams: {
      home: 'Atlanta Vibe',
      away: 'Grand Rapids Rise',
    },
    time: '6:30 PM ET',
    status: 'Scheduled',
    venue: 'Gas South Arena, Atlanta',
    broadcast: 'FS2',
  },
  {
    id: '6',
    sport: 'Golf',
    league: 'LPGA Tour',
    teams: {
      home: 'Minjee Lee',
      away: 'Jin Young Ko',
      homeScore: -4,
      awayScore: -2,
    },
    time: 'All Day',
    status: 'Live',
    venue: 'Shadow Creek Golf Course',
    broadcast: 'Golf Channel',
  },
  {
    id: '7',
    sport: 'Tennis',
    league: 'WTA',
    teams: {
      home: 'Coco Gauff',
      away: 'Emma Raducanu',
    },
    time: '3:00 PM ET',
    status: 'Scheduled',
    venue: 'Indian Wells Tennis Garden',
    broadcast: 'Tennis Channel',
  },
  {
    id: '8',
    sport: 'Hockey',
    league: 'PHF',
    teams: {
      home: 'Boston Pride',
      away: 'Toronto Six',
    },
    time: '7:30 PM ET',
    status: 'Scheduled',
    venue: 'Warrior Ice Arena, Boston',
    broadcast: 'ESPN+',
  },
  {
    id: '9',
    sport: 'Basketball',
    league: 'WNBA',
    teams: {
      home: 'Phoenix Mercury',
      away: 'Los Angeles Sparks',
    },
    time: '9:00 PM ET',
    status: 'Scheduled',
    venue: 'Footprint Center, Phoenix',
    broadcast: 'NBA TV',
  },
  {
    id: '10',
    sport: 'Soccer',
    league: 'NWSL',
    teams: {
      home: 'Angel City FC',
      away: 'San Diego Wave FC',
    },
    time: '10:00 PM ET',
    status: 'Scheduled',
    venue: 'BMO Stadium, Los Angeles',
    broadcast: 'CBS Sports Network',
  },
];
