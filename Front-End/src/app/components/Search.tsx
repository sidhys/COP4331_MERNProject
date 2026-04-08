import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ShoppingCart, User, Star, Tag, Search as SearchIcon, ArrowLeft } from "lucide-react";
import { games } from "../data/games";
import { useCart } from "../context/CartContext";
import { useLibrary } from "../context/LibraryContext";

export function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, getCartItemCount } = useCart();
  const { isGameOwned } = useLibrary();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleAddToCart = (gameId: string) => {
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }
    addToCart(gameId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase();
    return (
      game.title.toLowerCase().includes(query) ||
      game.genre.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1
              onClick={() => navigate("/")}
              className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent cursor-pointer"
            >
              Citrus
            </h1>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Store
              </button>
              <button
                onClick={() => navigate("/library")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Library
              </button>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Community
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              />
            </form>
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Sign Up
              </button>
            ) : (
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <User className="w-4 h-4" />
                Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>

          <h1 className="text-3xl font-bold mb-2">
            Search Results for "{searchParams.get("q")}"
          </h1>
          <p className="text-slate-400">
            {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} found
          </p>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="w-24 h-24 text-slate-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No games found</h2>
            <p className="text-slate-400 mb-8">
              Try searching for different keywords or browse all games in the store.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              Browse Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-slate-800 hover:border-orange-500/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {game.originalPrice && (
                    <div className="absolute top-2 right-2 bg-orange-600 px-2 py-1 rounded flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span className="text-xs">
                        {Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg">{game.title}</h4>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{game.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-3">{game.genre}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {game.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-800 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {game.originalPrice && (
                        <span className="text-sm text-slate-500 line-through">
                          ${game.originalPrice}
                        </span>
                      )}
                      <span className="text-xl font-bold text-orange-400">
                        ${game.price}
                      </span>
                    </div>
                    {isGameOwned(game.id) ? (
                      <button
                        onClick={() => navigate("/library")}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        In Library
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(game.id)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">About</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reddit</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © 2026 Citrus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
