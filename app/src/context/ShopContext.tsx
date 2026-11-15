import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { getProductById } from "../data/products";
import type { CartItem } from "../types/product";

interface ShopContextValue {
  cartItems: CartItem[];
  wishlistIds: string[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useLocalStorageState<CartItem[]>("gpu-shop:cart", []);
  const [wishlistIds, setWishlistIds] = useLocalStorageState<string[]>("gpu-shop:wishlist", []);

  function addToCart(productId: string, quantity = 1) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      const product = getProductById(productId);
      const maxStock = product?.stock ?? 0;
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQty } : item,
        );
      }
      return [...prev, { productId, quantity: Math.min(quantity, maxStock) }];
    });
  }

  function removeFromCart(productId: string) {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function updateCartQuantity(productId: string, quantity: number) {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      const product = getProductById(productId);
      const maxStock = product?.stock ?? 0;
      return prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, maxStock) }
          : item,
      );
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  function toggleWishlist(productId: string) {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }

  function isWishlisted(productId: string) {
    return wishlistIds.includes(productId);
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [cartItems],
  );

  const value: ShopContextValue = {
    cartItems,
    wishlistIds,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    isWishlisted,
    cartCount,
    cartTotal,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
