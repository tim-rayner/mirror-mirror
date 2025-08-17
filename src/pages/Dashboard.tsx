import { CheckCircle, Error, Schedule } from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ApiResponse } from "../api/client";
import { mirrorApi } from "../api/client";
import { AppGrid } from "../components/AppGrid";
import { FairytaleHeading } from "../components/FairytaleHeading";
import { useAppManager } from "../hooks/useAppManager";

export const Dashboard = () => {
  const [apiTest, setApiTest] = useState<ApiResponse<string> | null>(null);
  const [config, setConfig] = useState<ApiResponse<unknown> | null>(null);
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

        // Test API connectivity
        const testResult = await mirrorApi.testApi();
        setApiTest(testResult);

        // Get system configuration
        const configResult = await mirrorApi.getConfig();
        setConfig(configResult);

        // Get installed modules
        const modulesResult = await mirrorApi.getInstalledModules();
        if (modulesResult.success && modulesResult.data) {
          initializeAppStates(modulesResult.data);
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

  const getStatusMessage = () => {
    if (!apiTest) return "Checking mirror enchantments...";

    if (apiTest.success) {
      return "Your magical mirror is awake and ready to serve!";
    } else {
      return "The mirror seems to be sleeping. Check your connection.";
    }
  };

  const handleAppToggle = async (appId: string) => {
    const appState = getDashboardApps().find((app) => app.id === appId);
    if (!appState) return;

    setLoadingStates((prev) => ({ ...prev, [appId]: true }));

    try {
      const moduleName = appState.longname ?? appState.name;
      if (appState.isVisibleOnMirror) {
        await mirrorApi.hideModule(moduleName);
      } else {
        await mirrorApi.showModule(moduleName);
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

      {/* Status and Configuration Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: 3,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          System Status
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
          }}
        >
          {/* Status Card */}
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              {apiTest?.success ? (
                <CheckCircle
                  sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                />
              ) : (
                <Error sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
              )}
              <Typography variant="h6" gutterBottom>
                Mirror Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getStatusMessage()}
              </Typography>
            </CardContent>
          </Card>

          {/* Configuration Card */}
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Schedule sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {config?.success ? "Loaded" : "Not available"}
              </Typography>
            </CardContent>
          </Card>

          {/* API Status Card */}
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" gutterBottom>
                API Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {apiTest?.data || "Unknown"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Quick Enchantments
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Use the navigation menu to control your mirror. Open or close apps,
          change scenes, and adjust system settings.
        </Typography>
      </Box>
    </Box>
  );
};
