// context/appReady.tsx
import React, { createContext, useContext, useState } from 'react';

type AppReadyContextType = {
  isAppReady: boolean;
  setAppReady: (ready: boolean) => void;
};

const AppReadyContext = createContext<AppReadyContextType>({
  isAppReady: false,
  setAppReady: () => {},
});

export const useAppReady = () => useContext(AppReadyContext);

export const AppReadyProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <AppReadyContext.Provider value={{ isAppReady, setAppReady: setIsAppReady }}>
      {children}
    </AppReadyContext.Provider>
  );
};