import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface FairytaleHeadingProps {
  title: string;
  subtitle?: string;
  variant?: "h1" | "h2" | "h3";
}

const StyledHeading = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    marginBottom: theme.spacing(3),
  },
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: "center",
  fontStyle: "italic",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    marginBottom: theme.spacing(4),
  },
}));

export const FairytaleHeading = ({
  title,
  subtitle,
  variant = "h2",
}: FairytaleHeadingProps) => {
  return (
    <Box component="header" sx={{ mb: 4 }}>
      <StyledHeading variant={variant}>{title}</StyledHeading>
      {subtitle && <StyledSubtitle variant="body1">{subtitle}</StyledSubtitle>}
    </Box>
  );
};
