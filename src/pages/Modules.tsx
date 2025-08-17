import { Dashboard, DashboardOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Module } from "../api/client";
import { mirrorApi } from "../api/client";
import { FairytaleHeading } from "../components/FairytaleHeading";
import { useAppManager } from "../hooks/useAppManager";

export const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const {
    initializeAppStates,
    toggleMirrorVisibility,
    toggleDashboardVisibility,
    getAppState,
  } = useAppManager();

  // helper for consistent IDs
  const getId = (m: Module) => m.identifier ?? m.longname ?? m.name;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await mirrorApi.getInstalledModules();
        if (!res.success || !res.data) throw new Error("Failed to fetch apps");

        setModules(res.data);
        initializeAppStates(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch apps");
      } finally {
        setLoading(false);
      }
    })();
  }, [initializeAppStates]);

  const handleModuleToggle = async (module: Module) => {
    const id = getId(module);
    const appState = getAppState(id);
    if (!appState) return;

    setLoadingStates((s) => ({ ...s, [id]: true }));

    try {
      const name = module.longname ?? module.name;
      if (appState.isVisibleOnMirror) {
        await mirrorApi.hideModule(name);
      } else {
        await mirrorApi.showModule(name);
      }

      toggleMirrorVisibility(id);
    } catch (err) {
      console.error(`Failed to toggle ${module.name}`, err);
    } finally {
      setLoadingStates((s) => ({ ...s, [id]: false }));
    }
  };

  const handleDashboardToggle = (module: Module) => {
    const id = getId(module);
    toggleDashboardVisibility(id);
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
        title="Magical Apps"
        subtitle="Open and close apps on your mirror"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {modules.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No apps found. Your mirror might be sleeping or not connected.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {modules.map((module) => {
            const id = getId(module);
            const appState = getAppState(id);

            if (!appState) return null;

            return (
              <Card key={id}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography variant="h6" component="h3" sx={{ mr: 2 }}>
                          {module.name}
                        </Typography>
                        <Chip
                          label={
                            appState.isVisibleOnMirror ? "Active" : "Inactive"
                          }
                          size="small"
                          color={
                            appState.isVisibleOnMirror ? "success" : "default"
                          }
                          variant={
                            appState.isVisibleOnMirror ? "filled" : "outlined"
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {module.desc ??
                          (appState.isVisibleOnMirror
                            ? "This app is currently visible on your mirror."
                            : "This app is currently hidden from your mirror.")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Tooltip
                        title={
                          appState.isHiddenFromDashboard
                            ? "Show on dashboard"
                            : "Hide from dashboard"
                        }
                        placement="top"
                      >
                        <IconButton
                          onClick={() => handleDashboardToggle(module)}
                          size="small"
                          color={
                            appState.isHiddenFromDashboard
                              ? "default"
                              : "primary"
                          }
                          aria-label={`${
                            appState.isHiddenFromDashboard ? "Show" : "Hide"
                          } ${module.name} from dashboard`}
                        >
                          {appState.isHiddenFromDashboard ? (
                            <DashboardOutlined />
                          ) : (
                            <Dashboard />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Switch
                        checked={appState.isVisibleOnMirror}
                        onChange={() => handleModuleToggle(module)}
                        disabled={loadingStates[id] ?? false}
                        color="primary"
                        aria-label={`Toggle ${module.name}`}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
