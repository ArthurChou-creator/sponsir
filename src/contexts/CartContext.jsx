import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      if (prev.some((i) => i.planId === item.planId)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (planId) => {
    setCartItems((prev) => prev.filter((i) => i.planId !== planId));
  };

  const clearCart = () => setCartItems([]);

  // Called after successful checkout — saves purchased items with tx data
  const recordPurchases = (items, txHash) => {
    const timestamp = new Date().toISOString();
    const newPurchases = items.map((item) => ({
      id: `${item.planId}-${Date.now()}`,
      eventId: item.eventId,
      eventTitle: item.eventTitle,
      eventDate: item.eventDate || null,
      eventLocation: item.eventLocation || null,
      planId: item.planId,
      planTitle: item.planTitle,
      price: item.price,
      txHash,
      purchasedAt: timestamp,
      status: "confirmed",
      // Brand assets the sponsor can upload after purchase
      brandAssets: {
        logoUrl: "",
        bannerUrl: "",
        bio: "",
        website: "",
        twitter: "",
        telegram: "",
      },
    }));
    setPurchases((prev) => [...prev, ...newPurchases]);
  };

  const updateBrandAssets = (purchaseId, assets) => {
    setPurchases((prev) =>
      prev.map((p) =>
        p.id === purchaseId ? { ...p, brandAssets: { ...p.brandAssets, ...assets } } : p
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        purchases,
        recordPurchases,
        updateBrandAssets,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
