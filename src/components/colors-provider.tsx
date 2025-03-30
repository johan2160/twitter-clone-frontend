import { createContext, useContext, useEffect, useState } from "react";

export type Color = "pink" | "orange" | "blue";

export interface ColorsProviderProps {
  children: React.ReactNode;
  defaultColor?: Color;
  storageKey?: string;
}

export interface ColorsProviderState {
  color: Color;
  setColor: (color: Color) => void;
}

const initialState: ColorsProviderState = {
  color: "pink",
  setColor: () => {},
};

const ColorsContext = createContext<ColorsProviderState>(initialState);

export function ColorsProvider({
  children,
  defaultColor = "pink",
  storageKey = "vite-ui-colors",
}: ColorsProviderProps) {
  const [color, setColorState] = useState<Color>(() => {
    return (localStorage.getItem(storageKey) as Color) || defaultColor;
  });

  useEffect(() => {
    if (color === "pink") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", color);
    }
  }, [color]);

  const setColor = (color: Color) => {
    localStorage.setItem(storageKey, color);
    setColorState(color);
  };

  return (
    <ColorsContext.Provider value={{ color, setColor }}>
      {children}
    </ColorsContext.Provider>
  );
}

export const useColors = () => {
  const context = useContext(ColorsContext);
  if (context === undefined) {
    throw new Error("useColors must be used within a ColorsProvider");
  }
  return context;
};
