import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { AppState } from "../hooks/useAppManager";

interface AppGridProps {
  apps: AppState[];
  onToggleApp: (appId: string) => void;
  loadingStates?: Record<string, boolean>;
}

export const AppGrid = ({
  apps,
  onToggleApp,
  loadingStates = {},
}: AppGridProps) => {
  const theme = useTheme();

  if (apps.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          color: "text.secondary",
        }}
      >
        <Typography variant="body1">
          No apps available. Check your mirror connection.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 3,
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        App Control
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(280px, 1fr))",
            md: "repeat(auto-fill, minmax(320px, 1fr))",
          },
        }}
      >
        {apps.map((app) => (
          <Card
            key={app.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      fontWeight: 500,
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {app.name}
                  </Typography>
                  {app.longname && app.longname !== app.name && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mb: 1,
                        fontStyle: "italic",
                      }}
                    >
                      {app.longname}
                    </Typography>
                  )}
                </Box>

                <Tooltip
                  title={
                    app.isVisibleOnMirror
                      ? "Visible on mirror"
                      : "Hidden from mirror"
                  }
                  placement="top"
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: app.isVisibleOnMirror
                        ? "success.main"
                        : "text.disabled",
                      ml: 1,
                    }}
                  >
                    {app.isVisibleOnMirror ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
              </Box>

              {app.desc && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.875rem", sm: "0.9rem" },
                    lineHeight: 1.4,
                  }}
                >
                  {app.desc}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: "auto",
                }}
              >
                <Chip
                  label={app.isVisibleOnMirror ? "Active" : "Inactive"}
                  size="small"
                  color={app.isVisibleOnMirror ? "success" : "default"}
                  variant={app.isVisibleOnMirror ? "filled" : "outlined"}
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  }}
                />

                <Switch
                  checked={app.isVisibleOnMirror}
                  onChange={() => onToggleApp(app.id)}
                  disabled={loadingStates[app.id] || false}
                  color="primary"
                  size="small"
                  aria-label={`Toggle ${app.name} on mirror`}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
