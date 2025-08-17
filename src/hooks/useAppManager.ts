import { useCallback, useEffect, useState } from "react";
import type { Module } from "../api/client";

export interface AppState {
  id: string;
  name: string;
  longname?: string;
  desc?: string;
  isVisibleOnMirror: boolean;
  isHiddenFromDashboard: boolean;
}

const STORAGE_KEY = "mirror-app-states";

export const useAppManager = () => {
  const [appStates, setAppStates] = useState<Record<string, AppState>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load app states from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAppStates(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load app states from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save app states to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appStates));
      } catch (error) {
        console.error("Failed to save app states to localStorage:", error);
      }
    }
  }, [appStates, isLoaded]);

  // Initialize app states from modules
  const initializeAppStates = useCallback((modules: Module[]) => {
    setAppStates((currentAppStates) => {
      const newStates: Record<string, AppState> = {};

      modules.forEach((module) => {
        const id = module.identifier ?? module.longname ?? module.name;
        const existingState = currentAppStates[id];

        newStates[id] = {
          id,
          name: module.name,
          longname: module.longname,
          desc: module.desc,
          isVisibleOnMirror: existingState?.isVisibleOnMirror ?? !module.hidden,
          isHiddenFromDashboard: existingState?.isHiddenFromDashboard ?? false,
        };
      });

      return newStates;
    });
  }, []);

  // Toggle app visibility on mirror
  const toggleMirrorVisibility = (appId: string) => {
    setAppStates((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isVisibleOnMirror: !prev[appId]?.isVisibleOnMirror,
      },
    }));
  };

  // Toggle app visibility on dashboard
  const toggleDashboardVisibility = (appId: string) => {
    setAppStates((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isHiddenFromDashboard: !prev[appId]?.isHiddenFromDashboard,
      },
    }));
  };

  // Get apps that should be shown on dashboard
  const getDashboardApps = () => {
    return Object.values(appStates).filter((app) => !app.isHiddenFromDashboard);
  };

  // Get apps that should be shown on mirror
  const getMirrorApps = () => {
    return Object.values(appStates).filter((app) => app.isVisibleOnMirror);
  };

  // Get app state by ID
  const getAppState = (appId: string) => {
    return appStates[appId];
  };

  return {
    appStates,
    isLoaded,
    initializeAppStates,
    toggleMirrorVisibility,
    toggleDashboardVisibility,
    getDashboardApps,
    getMirrorApps,
    getAppState,
  };
};
