import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "error";
}

interface ActionGridProps {
  items: ActionItem[];
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

const ActionButton = styled(Button)(() => ({
  marginTop: "auto",
  alignSelf: "flex-start",
  minWidth: "120px",
}));

export const ActionGrid = ({
  items,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
}: ActionGridProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || 2}, 1fr)`,
          md: `repeat(${columns.md || 3}, 1fr)`,
          lg: `repeat(${columns.lg || 4}, 1fr)`,
        },
      }}
    >
      {items.map((item) => (
        <Box key={item.id}>
          <StyledCard>
            <StyledCardContent>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 2,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3,
                  flexGrow: 1,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </Typography>

              <ActionButton
                variant={item.variant === "error" ? "outlined" : "contained"}
                color={item.variant === "error" ? "error" : "primary"}
                onClick={item.onAction}
                disabled={item.disabled || item.loading}
                aria-label={item.actionLabel}
                sx={{
                  "&:disabled": {
                    opacity: 0.6,
                  },
                }}
              >
                {item.loading ? "Loading..." : item.actionLabel}
              </ActionButton>
            </StyledCardContent>
          </StyledCard>
        </Box>
      ))}
    </Box>
  );
};
