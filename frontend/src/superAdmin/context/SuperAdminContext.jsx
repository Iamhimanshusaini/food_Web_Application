import { createContext, useContext, useMemo, useState } from "react";
import { initialRestaurants } from "../data/demoData";

const SuperAdminContext = createContext(null);

export function SuperAdminProvider({ children }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);

  const updateRestaurantStatus = (id, status) => {
    setRestaurants((current) =>
      current.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, status } : restaurant
      )
    );
  };

  const value = useMemo(
    () => ({ restaurants, setRestaurants, updateRestaurantStatus }),
    [restaurants]
  );

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error("useSuperAdmin must be used inside SuperAdminProvider");
  }
  return context;
}
