import { createContext, useContext } from "react";

export interface DashboardState {
  asset:           string;
  setAsset:        (a: string) => void;
  timeRange:       string;
  setTimeRange:    (t: string) => void;
  activeSubTab:    string;
  setActiveSubTab: (tab: string) => void;
}

export const DashboardContext = createContext<DashboardState>({
  asset:           "ALL",
  setAsset:        () => {},
  timeRange:       "30D",
  setTimeRange:    () => {},
  activeSubTab:    "",
  setActiveSubTab: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}
