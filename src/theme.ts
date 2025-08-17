import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF4FB6",
      light: "#FF4FB6",
      dark: "#FF4FB6",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#333333",
      light: "#C4C4C4",
      dark: "#000000",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#333333",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F9F9F9",
    },
    grey: {
      50: "#F9F9F9",
      300: "#C4C4C4",
      700: "#333333",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    h1: {
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
  spacing: (factor: number) => {
    const spacingValues = [0, 4, 8, 16, 24, 32, 48, 64];
    return `${spacingValues[factor] || factor * 8}px`;
  },
});
