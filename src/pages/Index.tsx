import { useState, useEffect } from 'react';
import { toast } from "sonner";
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import Loader from '@/components/Loader';
import SportFilter from '@/components/SportFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTodaysGames, getUniqueSports, Game, saveWatchlist, loadWatchlist } from '@/utils/sportsData';
import { useAuth } from '@/context/AuthContext';
import { LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { currentUser, signOut } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        toast("Scraping latest sports data...");
        
        const todaysGames = await fetchTodaysGames();
        
        if (todaysGames.length === 0) {
          setError("No games found for today. Please try again later.");
          toast("No games found for today");
        } else {
          setGames(todaysGames);
          setFilteredGames(todaysGames);
          setSports(getUniqueSports(todaysGames));
          
          const nwslCount = todaysGames.filter(game => game.league === 'NWSL').length;
          if (nwslCount > 0) {
            toast(`Latest games loaded, including ${nwslCount} NWSL matches!`);
          } else {
            toast("Latest games loaded successfully");
          }
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError("Failed to load games. Please try again later.");
        toast("Failed to scrape games", {
          description: "Check your connection and try again",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [refreshKey]);

  useEffect(() => {
    if (currentUser) {
      const savedWatchlist = loadWatchlist(currentUser.id);
      setWatchlist(savedWatchlist);
    } else {
      setWatchlist([]);
    }
  }, [currentUser]);

  useEffect(() => {
    let filtered = games;
    
    if (selectedSport) {
      filtered = filtered.filter(game => game.sport === selectedSport);
    }
    
    if (activeTab === "watchlist") {
      filtered = filtered.filter(game => watchlist.includes(game.id));
    }
    
    setFilteredGames(filtered);
  }, [selectedSport, games, watchlist, activeTab]);

  const handleToggleWatchlist = (gameId: string) => {
    if (!currentUser) return;
    
    let newWatchlist: string[];
    
    if (watchlist.includes(gameId)) {
      newWatchlist = watchlist.filter(id => id !== gameId);
      toast("Game removed from watchlist");
    } else {
      newWatchlist = [...watchlist, gameId];
      toast("Game added to watchlist");
    }
    
    setWatchlist(newWatchlist);
    saveWatchlist(newWatchlist, currentUser.id);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (selectedSport) {
      setSelectedSport(null);
    }
  };

  const handleRefresh = () => {
    toast("Refreshing games data...");
    setRefreshKey(prevKey => prevKey + 1);
  };

  const liveGames = filteredGames.filter(game => game.status === 'Live');
  const startingSoonGames = filteredGames.filter(game => game.status === 'Starting Soon');
  const upcomingGames = filteredGames.filter(game => game.status === 'Scheduled');
  const completedGames = filteredGames.filter(game => game.status === 'Completed');

  const isWatchlistEmpty = watchlist.length === 0 && activeTab === "watchlist";

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="container max-w-7xl pt-28 px-4 sm:px-6 md:px-8 mx-auto">
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium mb-3">
            Today's Schedule
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Women's Professional Sports</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with all of today's professional women's sports games, featuring live scores, 
            upcoming matches, and broadcast information.
          </p>
          
          {currentUser && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Signed in as <span className="font-medium">{currentUser.email}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-16 animate-fade-in">
            <h3 className="text-xl font-medium mb-2">Oops! Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              className="text-primary hover:underline"
              onClick={handleRefresh}
            >
              Refresh page
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All Games</TabsTrigger>
                  <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="ml-4 flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            {activeTab === "all" && (
              <SportFilter 
                sports={sports} 
                selectedSport={selectedSport} 
                onSelectSport={setSelectedSport} 
              />
            )}
            
            {isWatchlistEmpty ? (
              <div className="text-center py-16 animate-fade-in">
                <h3 className="text-xl font-medium mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Add games to your watchlist to keep track of the ones you want to watch.
                </p>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => setActiveTab("all")}
                >
                  Browse all games
                </button>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <h3 className="text-xl font-medium mb-2">No games found</h3>
                <p className="text-muted-foreground">
                  There are no games scheduled for today in {selectedSport}.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {liveGames.length > 0 && (
                  <section>
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse-slow"></div>
                      <h2 className="text-xl font-semibold">Live Now</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {liveGames.map((game, index) => (
                        <GameCard 
                          key={game.id} 
                          game={game} 
                          index={index} 
                          isInWatchlist={watchlist.includes(game.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </section>
                )}
                
                {startingSoonGames.length > 0 && (
                  <section>
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse-slow"></div>
                      <h2 className="text-xl font-semibold">Starting Soon</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {startingSoonGames.map((game, index) => (
                        <GameCard 
                          key={game.id} 
                          game={game} 
                          index={index} 
                          isInWatchlist={watchlist.includes(game.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </section>
                )}
                
                {upcomingGames.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Coming Up Today</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingGames.map((game, index) => (
                        <GameCard 
                          key={game.id} 
                          game={game} 
                          index={index} 
                          isInWatchlist={watchlist.includes(game.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </section>
                )}
                
                {completedGames.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Completed Games</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedGames.map((game, index) => (
                        <GameCard 
                          key={game.id} 
                          game={game} 
                          index={index} 
                          isInWatchlist={watchlist.includes(game.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="mt-16 container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Women's Sports Schedule • Data provided by Sports Scraper</p>
      </footer>
    </div>
  );
};

export default Index;
