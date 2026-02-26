import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../backend';

export interface TrialCartItem {
  product: Product;
  selectedSize: string;
  id: string;
}

export interface WardrobeData {
  tops: number;
  jeans: number;
  dresses: number;
  jackets: number;
  colorDistribution: { color: string; count: number; hex: string }[];
  scanned: boolean;
}

export interface BodyScanData {
  shoulder: string;
  chest: string;
  waist: string;
  height: string;
  recommendedSize: string;
  scanned: boolean;
}

interface AppContextType {
  trialCartItems: TrialCartItem[];
  addToTrialCart: (item: TrialCartItem) => void;
  removeFromTrialCart: (id: string) => void;
  clearTrialCart: () => void;
  bodyScanData: BodyScanData;
  setBodyScanData: (data: BodyScanData) => void;
  wardrobeData: WardrobeData;
  setWardrobeData: (data: WardrobeData) => void;
}

const defaultBodyScan: BodyScanData = {
  shoulder: '',
  chest: '',
  waist: '',
  height: '',
  recommendedSize: '',
  scanned: false,
};

const defaultWardrobe: WardrobeData = {
  tops: 0,
  jeans: 0,
  dresses: 0,
  jackets: 0,
  colorDistribution: [],
  scanned: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [trialCartItems, setTrialCartItems] = useState<TrialCartItem[]>([]);
  const [bodyScanData, setBodyScanData] = useState<BodyScanData>(defaultBodyScan);
  const [wardrobeData, setWardrobeData] = useState<WardrobeData>(defaultWardrobe);

  const addToTrialCart = (item: TrialCartItem) => {
    setTrialCartItems((prev) => {
      if (prev.length >= 5) return prev;
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromTrialCart = (id: string) => {
    setTrialCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearTrialCart = () => {
    setTrialCartItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        trialCartItems,
        addToTrialCart,
        removeFromTrialCart,
        clearTrialCart,
        bodyScanData,
        setBodyScanData,
        wardrobeData,
        setWardrobeData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
