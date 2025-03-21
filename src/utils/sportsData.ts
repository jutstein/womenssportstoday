
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

// Function to fetch real games data from API
export const fetchTodaysGames = async (): Promise<Game[]> => {
  try {
    // For demonstration, we'll use a free API that doesn't require authentication
    const response = await fetch('https://api.sportsdata.io/v3/wnba/scores/json/GamesByDate/2023-06-15', {
      headers: {
        // This is a placeholder API key - in a real app, this would be stored securely
        'Ocp-Apim-Subscription-Key': 'YOUR_SPORTSDATA_API_KEY'
      }
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status);
      // Fallback to mock data if API request fails
      return MOCK_GAMES;
    }
    
    const data = await response.json();
    
    // Map API response to our Game interface
    return mapApiResponseToGames(data);
  } catch (error) {
    console.error('Error fetching games data:', error);
    // Fallback to mock data if API request fails
    return MOCK_GAMES;
  }
};

// Helper function to map API response to our Game interface
const mapApiResponseToGames = (apiData: any[]): Game[] => {
  try {
    // If no data is returned or the API format is unexpected, return mock data
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      return MOCK_GAMES;
    }
    
    // Map API data to our Game interface
    return apiData.map((game: any) => ({
      id: game.GameID?.toString() || Math.random().toString(36).substring(2, 9),
      sport: 'Basketball',
      league: 'WNBA',
      teams: {
        home: game.HomeTeam || 'Unknown Team',
        away: game.AwayTeam || 'Unknown Team',
        homeScore: game.HomeTeamScore,
        awayScore: game.AwayTeamScore,
      },
      time: game.DateTime ? new Date(game.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ET' : 'TBD',
      status: mapGameStatus(game.Status),
      venue: game.Stadium?.Name || 'TBD',
      broadcast: game.Channel || 'Check local listings',
    }));
  } catch (error) {
    console.error('Error mapping API response:', error);
    return MOCK_GAMES;
  }
};

// Helper function to map API game status to our status format
const mapGameStatus = (apiStatus: string): Game['status'] => {
  if (!apiStatus) return 'Scheduled';
  
  const status = apiStatus.toLowerCase();
  if (status.includes('live') || status.includes('in progress')) return 'Live';
  if (status.includes('final') || status.includes('complete')) return 'Completed';
  if (status.includes('scheduled') && new Date().getTime() + 3600000 > new Date().getTime()) return 'Starting Soon';
  return 'Scheduled';
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

// Mock data as fallback for when API is unavailable
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
