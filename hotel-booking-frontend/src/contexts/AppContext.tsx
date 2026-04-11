import React, { useState, useEffect,useContext } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useToast } from "../hooks/use-toast";
const STRIPE_PUB_KEY = "your_stripe_key_here";

type ToastMessage = {
  title: string;
  description?: string;
  type: "SUCCESS" | "ERROR" | "INFO";
};

export type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  stripePromise: Promise<Stripe | null>;
  isGlobalLoading: boolean;
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
  globalLoadingMessage: string;
};

export const AppContext = React.createContext<AppContextType | undefined>(
  undefined
);
export const useAppContext = () => {
  const context = React.useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }

  return context;
};

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState(
    "Hotel room is getting ready..."
  );

  const { toast } = useToast();

  // 🔥 Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🔥 Login function
  const login = () => {
    setIsLoggedIn(true);
  };

  // 🔥 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Toast
  const showToast = (toastMessage: ToastMessage) => {
    toast({
      title: toastMessage.title,
      description: toastMessage.description,
    });
  };

  // Global loading
  const showGlobalLoading = (message?: string) => {
    if (message) setGlobalLoadingMessage(message);
    setIsGlobalLoading(true);
  };

  const hideGlobalLoading = () => {
    setIsGlobalLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        showToast,
        isLoggedIn,
        login,
        logout,
        stripePromise,
        isGlobalLoading,
        showGlobalLoading,
        hideGlobalLoading,
        globalLoadingMessage,
      }}
    >
      {isGlobalLoading && <LoadingSpinner message={globalLoadingMessage} />}
      {children}
    </AppContext.Provider>
  );
};