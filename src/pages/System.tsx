import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { SystemInfo } from "../api/client";
import { mirrorApi } from "../api/client";
import type { ActionItem } from "../components/ActionGrid";
import { ActionGrid } from "../components/ActionGrid";
import { FairytaleHeading } from "../components/FairytaleHeading";

export const System = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [brightness, setBrightness] = useState(50);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await mirrorApi.getConfig();
      // Extract system info from config
      const defaultBrightness = 50;
      setSystemInfo({
        success: config.success,
        data: {
          brightness: defaultBrightness, // Default value, will be updated when brightness is set
          platform: "Magic Mirror",
          nodeVersion: "Unknown",
        },
      });
      setBrightness(defaultBrightness);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch system info"
      );
    } finally {
      setLoading(false);
    }
  };

  // Debounced brightness change handler
  const debouncedBrightnessChange = useCallback(
    (() => {
      let timeoutId: number;
      return (value: number) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            await mirrorApi.setBrightness(value);
            // Update system info to reflect the new brightness
            setSystemInfo((prev) =>
              prev
                ? {
                    ...prev,
                    data: { ...prev.data, brightness: value },
                  }
                : null
            );
          } catch (err) {
            console.error("Failed to set brightness:", err);
            // Revert to previous value on error
            setBrightness(systemInfo?.data?.brightness || 50);
          }
        }, 300); // 300ms debounce
      };
    })(),
    [systemInfo?.data?.brightness]
  );

  const handleBrightnessChange = (value: number) => {
    // Update UI immediately
    setBrightness(value);
    // Debounce the API call
    debouncedBrightnessChange(value);
  };

  const handleSystemAction = async (action: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [action]: true }));

      switch (action) {
        case "refresh":
          await mirrorApi.refresh();
          break;
        case "restart":
          await mirrorApi.restart();
          break;
        case "reboot":
          await mirrorApi.reboot();
          break;
      }
    } catch (err) {
      console.error(`Failed to ${action}:`, err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [action]: false }));
    }
  };

  const systemActions: ActionItem[] = [
    {
      id: "refresh",
      title: "Refresh Modules",
      description: "Reload all modules and their configurations.",
      actionLabel: "Refresh",
      onAction: () => handleSystemAction("refresh"),
      loading: loadingStates["refresh"] || false,
    },
    {
      id: "restart",
      title: "Restart Mirror",
      description: "Restart the Magic Mirror application.",
      actionLabel: "Restart",
      onAction: () => handleSystemAction("restart"),
      loading: loadingStates["restart"] || false,
    },
    {
      id: "reboot",
      title: "Reboot Device",
      description: "Reboot the entire device (use with caution).",
      actionLabel: "Reboot",
      onAction: () => handleSystemAction("reboot"),
      loading: loadingStates["reboot"] || false,
      variant: "error",
    },
  ];

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
        title="System Settings"
        subtitle="Control your mirror's brightness and perform system actions"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Brightness Control */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mirror Brightness
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust the brightness of your magical mirror display.
          </Typography>

          <Box sx={{ px: 2 }}>
            <Slider
              value={brightness}
              onChange={(_, value) => handleBrightnessChange(value as number)}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: "0%" },
                { value: 50, label: "50%" },
                { value: 100, label: "100%" },
              ]}
              valueLabelDisplay="auto"
              aria-label="Brightness control"
              sx={{
                "& .MuiSlider-markLabel": {
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Current brightness: {brightness}%
          </Typography>
        </CardContent>
      </Card>

      {/* System Info */}
      {systemInfo && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Information
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Platform:</strong>{" "}
                {systemInfo.data?.platform || "Unknown"}
              </Typography>
              <Typography variant="body2">
                <strong>Node Version:</strong>{" "}
                {systemInfo.data?.nodeVersion || "Unknown"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* System Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        System Actions
      </Typography>

      <ActionGrid items={systemActions} columns={{ xs: 1, sm: 2, md: 3 }} />
    </Box>
  );
};
