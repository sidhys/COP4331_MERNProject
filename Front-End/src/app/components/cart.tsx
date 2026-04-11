import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useStoredUser } from "../lib/authStorage";
import { getGameGenre } from "../lib/gameUtils";
import { useCart } from "./cartContext";
import { useGames } from "./gamesContext";
import { useLibrary } from "./libraryContext";

export function Cart() {
  const navigate = useNavigate();
  const user = useStoredUser();
  const { isLoading: areGamesLoading } = useGames();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const { addGamesToLibrary, isLoading: isLibraryLoading } = useLibrary();
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleCheckout = async () => {
    setCheckoutError("");

    const gameIds = cart.map((item) => item.game.id);
    const didSave = await addGamesToLibrary(gameIds);

    if (!didSave) {
      setCheckoutError("Could not update your library. Please try again.");
      return;
    }

    clearCart();
    navigate("/library");
  };

  const isWaitingOnCatalog = areGamesLoading && getCartItemCount() > 0 && cart.length === 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 transition-colors hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </button>

        <div className="mb-8 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-orange-400" />
          <h1 className="text-4xl font-bold">Your Cart</h1>
        </div>

        {isWaitingOnCatalog ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-300">
            Loading cart items...
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="mb-3 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-slate-400">Add some games from the store to get started.</p>
            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-orange-600 px-6 py-3 transition-colors hover:bg-orange-700"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.game.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row"
                >
                  <img
                    src={item.game.imageUrl || ""}
                    alt={item.game.title}
                    className="h-36 w-full rounded-xl object-cover md:w-56"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="mb-2 text-2xl font-semibold">{item.game.title}</h2>
                      <p className="mb-2 text-slate-400">{getGameGenre(item.game)}</p>
                      <p className="text-sm text-slate-300">
                        {item.game.description || "Ready to add to your Citrus library."}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                          className="rounded-lg bg-slate-800 p-2 transition-colors hover:bg-slate-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="w-8 text-center text-lg font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                          className="rounded-lg bg-slate-800 p-2 transition-colors hover:bg-slate-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-orange-400">
                          ${(item.game.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.game.id)}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

              <div className="mb-3 flex justify-between text-slate-300">
                <span>Items</span>
                <span>{getCartItemCount()}</span>
              </div>

              <div className="mb-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-orange-400">${getCartTotal().toFixed(2)}</span>
              </div>

              {checkoutError && (
                <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {checkoutError}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isLibraryLoading}
                className="mb-3 w-full rounded-lg bg-orange-600 py-3 font-medium transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLibraryLoading ? "Updating Library..." : "Proceed to Checkout"}
              </button>

              <button
                onClick={clearCart}
                className="w-full rounded-lg bg-slate-800 py-3 font-medium transition-colors hover:bg-slate-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
