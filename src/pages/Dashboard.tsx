import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { mirrorApi } from "../api/client";
import { AppGrid } from "../components/AppGrid";
import { FairytaleHeading } from "../components/FairytaleHeading";
import { filterBlacklistedModules } from "../constants/moduleBlacklist";
import { useAppManager } from "../hooks/useAppManager";

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const {
    isLoaded: appStatesLoaded,
    initializeAppStates,
    toggleMirrorVisibility,
    getDashboardApps,
  } = useAppManager();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get active modules
        const activeModulesResult = await mirrorApi.getActiveModules();
        if (activeModulesResult.success && activeModulesResult.data) {
          // Filter out blacklisted modules
          const filteredModules = filterBlacklistedModules(
            activeModulesResult.data
          );

          // Convert ActiveModule[] to Module[] for compatibility with useAppManager
          const moduleData = filteredModules.map((m) => ({
            identifier: m.identifier ?? m.longname ?? m.name,
            name: m.name,
            longname: m.longname,
            desc: m.desc,
            // Force QRAccess to be considered as hidden
            hidden: m.name === "MMM-QRAccess" ? true : m.hidden,
          }));
          initializeAppStates(moduleData);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error && "message" in err
            ? String(err.message)
            : "Failed to connect to mirror";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [initializeAppStates]);

  const handleAppToggle = async (appId: string) => {
    const appState = getDashboardApps().find((app) => app.id === appId);
    if (!appState) return;

    setLoadingStates((prev) => ({ ...prev, [appId]: true }));

    try {
      const moduleName = appState.longname ?? appState.name;
      if (appState.isVisibleOnMirror) {
        const r = await mirrorApi.hideModule(moduleName);
        if (!r.success) throw new Error("Hide failed");
      } else {
        const r = await mirrorApi.showModule(moduleName);
        if (!r.success) throw new Error("Show failed");
      }

      toggleMirrorVisibility(appId);
    } catch (err) {
      console.error(`Failed to toggle ${appState.name}`, err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [appId]: false }));
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <FairytaleHeading
        title="Charlotte's Magic Mirror"
        subtitle="Your magical mirror awaits your commands"
        variant="h1"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* App Grid - Only show if we have apps and app states are loaded */}
      {appStatesLoaded && getDashboardApps().length > 0 && (
        <Box sx={{ mb: 6 }}>
          <AppGrid
            apps={getDashboardApps()}
            onToggleApp={handleAppToggle}
            loadingStates={loadingStates}
          />
        </Box>
      )}
    </Box>
  );
};
