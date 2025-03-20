
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import Loader from '@/components/Loader';
import SportFilter from '@/components/SportFilter';
import { fetchTodaysGames, getUniqueSports, Game } from '@/utils/sportsData';

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const todaysGames = await fetchTodaysGames();
        setGames(todaysGames);
        setFilteredGames(todaysGames);
        setSports(getUniqueSports(todaysGames));
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      setFilteredGames(games.filter(game => game.sport === selectedSport));
    } else {
      setFilteredGames(games);
    }
  }, [selectedSport, games]);

  // Group games by status for better organization
  const liveGames = filteredGames.filter(game => game.status === 'Live');
  const startingSoonGames = filteredGames.filter(game => game.status === 'Starting Soon');
  const upcomingGames = filteredGames.filter(game => game.status === 'Scheduled');

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
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <>
            <SportFilter 
              sports={sports} 
              selectedSport={selectedSport} 
              onSelectSport={setSelectedSport} 
            />
            
            {filteredGames.length === 0 ? (
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
                        <GameCard key={game.id} game={game} index={index} />
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
                        <GameCard key={game.id} game={game} index={index} />
                      ))}
                    </div>
                  </section>
                )}
                
                {upcomingGames.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Coming Up Today</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingGames.map((game, index) => (
                        <GameCard key={game.id} game={game} index={index} />
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
        <p>© {new Date().getFullYear()} Women's Sports Schedule • All information is for demonstration purposes only</p>
      </footer>
    </div>
  );
};

export default Index;
