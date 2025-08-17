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
import type { ActiveModule as Module } from "../api/client";
import { mirrorApi } from "../api/client";
import { FairytaleHeading } from "../components/FairytaleHeading";
import { filterBlacklistedModules } from "../constants/moduleBlacklist";
import { useAppManager } from "../hooks/useAppManager";
import { normalizeModuleName } from "../utils/moduleNameUtils";

export const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({});

  const { initializeAppStates, toggleDashboardVisibility, getAppState } =
    useAppManager();

  const getId = (m: Module) => m.identifier ?? m.longname ?? m.name;

  // Get display name for UI (normalized version of module name)
  const getDisplayName = (m: Module) => {
    return normalizeModuleName(m.name);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await mirrorApi.getActiveModules();
        if (!res.success || !res.data)
          throw new Error("Failed to fetch active modules");

        // Filter out blacklisted modules
        const filteredModules = filterBlacklistedModules(res.data);
        setModules(filteredModules);

        // Initialize mirror visibility states from API response
        const initial = filteredModules.reduce<Record<string, boolean>>(
          (acc, m) => {
            acc[getId(m)] = !(m.hidden ?? false);
            return acc;
          },
          {}
        );
        setModuleStates(initial);

        // Initialize app manager states for dashboard functionality
        // Convert ActiveModule[] to Module[] for compatibility
        const moduleData = filteredModules.map((m) => ({
          identifier: m.identifier ?? m.longname ?? m.name,
          name: m.name,
          longname: m.longname,
          desc: m.desc,
          hidden: m.hidden,
        }));
        initializeAppStates(moduleData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch apps");
      } finally {
        setLoading(false);
      }
    })();
  }, [initializeAppStates]);

  const handleModuleToggle = async (module: Module) => {
    const id = getId(module);
    const next = !(moduleStates[id] ?? false);

    setLoadingStates((s) => ({ ...s, [id]: true }));
    setModuleStates((s) => ({ ...s, [id]: next })); // optimistic

    try {
      const name = module.longname ?? module.name;
      if (next) {
        const r = await mirrorApi.showModule(name);
        if (!r.success) throw new Error("Show failed");
      } else {
        const r = await mirrorApi.hideModule(name);
        if (!r.success) throw new Error("Hide failed");
      }
    } catch (err) {
      // revert on failure
      setModuleStates((s) => ({ ...s, [id]: !next }));
      console.error(`Failed to toggle ${getDisplayName(module)}`, err);
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
                          {getDisplayName(module)}
                        </Typography>
                        <Chip
                          label={
                            moduleStates[id] ?? false ? "Active" : "Inactive"
                          }
                          size="small"
                          color={
                            moduleStates[id] ?? false ? "success" : "default"
                          }
                          variant={
                            moduleStates[id] ?? false ? "filled" : "outlined"
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {module.desc ??
                          (moduleStates[id] ?? false
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
                          } ${getDisplayName(module)} from dashboard`}
                        >
                          {appState.isHiddenFromDashboard ? (
                            <DashboardOutlined />
                          ) : (
                            <Dashboard />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Switch
                        checked={moduleStates[id] ?? false}
                        onChange={() => handleModuleToggle(module)}
                        disabled={loadingStates[id] ?? false}
                        color="primary"
                        aria-label={`Toggle ${getDisplayName(module)}`}
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
