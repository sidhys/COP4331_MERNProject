import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, User, Star, Tag, Search, SlidersHorizontal } from "lucide-react";
import { clearStoredUser, useStoredUser } from "../lib/authStorage";
import { getGameDiscountPercentage, getGameGenre, isNewRelease } from "../lib/gameUtils";
import { useCart } from "./cartContext";
import { useGames } from "./gamesContext";
import { useLibrary } from "./libraryContext";

const priceFilterOptions = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "under-20", label: "Under $20" },
  { value: "20-40", label: "$20 to $40" },
  { value: "40-plus", label: "$40+" },
];

export function Store() {
  const navigate = useNavigate();
  const { addToCart, getCartItemCount } = useCart();
  const { games, isLoading, error } = useGames();
  const { isGameOwned } = useLibrary();
  const user = useStoredUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const featuredGame = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  const genreOptions = Array.from(
    new Set(
      games.flatMap((game) => {
        const values = [game.genre, ...(game.genres || [])];
        return values.filter((value): value is string => Boolean(value));
      }),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const tagOptions = Array.from(
    new Set(games.flatMap((game) => game.tags)),
  ).sort((a, b) => a.localeCompare(b));

  const handleLogout = () => {
    clearStoredUser();
    navigate("/login");
  };

  const handleAddToCart = (gameId: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (isGameOwned(gameId)) {
      navigate("/library");
      return;
    }

    addToCart(gameId);
  };

  const matchesPriceFilter = (price: number) => {
    if (selectedPrice === "all") {
      return true;
    }

    if (selectedPrice === "free") {
      return price === 0;
    }

    if (selectedPrice === "under-20") {
      return price < 20;
    }

    if (selectedPrice === "20-40") {
      return price >= 20 && price <= 40;
    }

    if (selectedPrice === "40-plus") {
      return price > 40;
    }

    return true;
  };

  const filteredGames = games.filter((game) => {
    const query = searchQuery.trim().toLowerCase();
    const genre = getGameGenre(game);
    const matchesSearch =
      query.length === 0 ||
      game.title.toLowerCase().includes(query) ||
      genre.toLowerCase().includes(query) ||
      (game.developer || "").toLowerCase().includes(query) ||
      game.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesQuickFilter =
      activeFilter === "all" ||
      (activeFilter === "sale" && !!game.originalPrice) ||
      (activeFilter === "new" && isNewRelease(game));

    const matchesGenre =
      selectedGenre === "all" ||
      genre === selectedGenre ||
      (game.genres || []).includes(selectedGenre);

    const matchesTag =
      selectedTag === "all" ||
      game.tags.includes(selectedTag);

    return (
      matchesSearch &&
      matchesQuickFilter &&
      matchesGenre &&
      matchesTag &&
      matchesPriceFilter(game.price)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <h1 className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
              Citrus
            </h1>
            <nav className="hidden gap-6 md:flex">
              <button
                onClick={() => navigate("/")}
                className="text-slate-300 transition-colors hover:text-white"
              >
                Store
              </button>
              <button
                onClick={() => navigate("/library")}
                className="text-slate-300 transition-colors hover:text-white"
              >
                Library
              </button>
              <button
                onClick={() => navigate("/community")}
                className="text-slate-300 transition-colors hover:text-white"
              >
                Community
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-64 rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm transition-colors focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="relative rounded-lg p-2 transition-colors hover:bg-slate-800"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {!user ? (
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 transition-colors hover:bg-orange-700"
              >
                <User className="h-4 w-4" />
                Sign Up
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 transition-colors hover:bg-slate-700"
                >
                  <User className="h-4 w-4" />
                  {user.username}
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-orange-600 px-4 py-2 transition-colors hover:bg-orange-700"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {featuredGame ? (
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          <img
            src={featuredGame.imageUrl || ""}
            alt={featuredGame.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4">
              <div className="max-w-xl">
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-orange-300">
                  Featured Pick
                </p>
                <h2 className="mb-4 text-5xl font-bold">{featuredGame.title}</h2>
                <p className="mb-6 text-xl text-slate-300">
                  {featuredGame.description || "Explore the latest standout release in the Citrus catalog."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() =>
                      isGameOwned(featuredGame.id)
                        ? navigate("/library")
                        : handleAddToCart(featuredGame.id)
                    }
                    className={`rounded-lg px-8 py-3 transition-colors ${
                      isGameOwned(featuredGame.id)
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-orange-600 hover:bg-orange-700"
                    }`}
                  >
                    {isGameOwned(featuredGame.id)
                      ? "In Library"
                      : `Buy Now - $${featuredGame.price.toFixed(2)}`}
                  </button>
                  <button
                    onClick={() => navigate(`/game/${featuredGame.id}`)}
                    className="rounded-lg bg-slate-800 px-8 py-3 transition-colors hover:bg-slate-700"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-slate-900 bg-slate-950 px-4 py-24 text-center">
          <h2 className="text-4xl font-bold">Citrus Store</h2>
          <p className="mt-3 text-slate-400">Game data will appear here once the catalog loads.</p>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-3xl font-bold">Featured Games</h3>
            <p className="mt-2 text-slate-400">
              Filter by genre, tag, and price to narrow the catalog.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "sale", label: "On Sale" },
              { value: "new", label: "New" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                  activeFilter === filter.value
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-slate-400">
            <SlidersHorizontal className="h-4 w-4" />
            Browse Filters
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Genre</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All Genres</option>
                {genreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Tag</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All Tags</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Price</span>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              >
                {priceFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("all");
                  setSelectedTag("all");
                  setSelectedPrice("all");
                  setActiveFilter("all");
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm transition-colors hover:bg-slate-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        ) : isLoading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            Loading games...
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h4 className="text-2xl font-semibold">No games match these filters</h4>
            <p className="mt-3 text-slate-400">
              Try a different genre, tag, or price range.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-slate-400">
              Showing {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => {
                const discount = getGameDiscountPercentage(game);

                return (
                  <div
                    key={game.id}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:scale-105 hover:border-orange-500/50"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={game.imageUrl || ""}
                        alt={game.title}
                        className="h-full w-full object-cover"
                      />
                      {discount > 0 && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-orange-600 px-2 py-1">
                          <Tag className="h-3 w-3" />
                          <span className="text-xs">{discount}% OFF</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h4
                          onClick={() => navigate(`/game/${game.id}`)}
                          className="cursor-pointer text-lg font-semibold transition-colors hover:text-orange-400"
                        >
                          {game.title}
                        </h4>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm">{game.rating || 0}</span>
                        </div>
                      </div>

                      <p className="mb-3 text-sm text-slate-400">{getGameGenre(game)}</p>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {game.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-slate-800 px-2 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {game.originalPrice && (
                            <span className="text-sm text-slate-500 line-through">
                              ${game.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-xl font-bold text-orange-400">
                            ${game.price.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            isGameOwned(game.id)
                              ? navigate("/library")
                              : handleAddToCart(game.id)
                          }
                          className={`rounded-lg px-4 py-2 transition-colors ${
                            isGameOwned(game.id)
                              ? "bg-slate-700 hover:bg-slate-600"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          {isGameOwned(game.id) ? "In Library" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      <footer className="mt-20 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h5 className="mb-4 font-semibold">About</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="transition-colors hover:text-white">About Us</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-semibold">Support</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="transition-colors hover:text-white">Help Center</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Contact Us</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Forums</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-semibold">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="transition-colors hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-semibold">Community</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="transition-colors hover:text-white">Discord</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Twitter</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Reddit</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2026 Citrus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
