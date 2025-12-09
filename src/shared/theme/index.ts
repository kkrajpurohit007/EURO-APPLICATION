/**
 * Theme Configuration
 * Centralized design tokens for consistent UI across all modules
 */

export const theme = {
  // Colors
  colors: {
    primary: "#405189",
    secondary: "#878a99",
    success: "#0ab39c",
    danger: "#f06548",
    warning: "#f7b84b",
    info: "#299cdb",
    light: "#f3f6f9",
    dark: "#212529",
  },

  // Spacing (Bootstrap-based)
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    xxl: "3rem",     // 48px
  },

  // Border Radius
  borderRadius: {
    sm: "0.25rem",   // 4px
    md: "0.375rem",  // 6px
    lg: "0.5rem",    // 8px
    xl: "0.75rem",   // 12px
    full: "50%",
  },

  // Shadows
  shadows: {
    sm: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    md: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    lg: "0 1rem 3rem rgba(0, 0, 0, 0.175)",
    hover: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },

  // Transitions
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.3s ease-in-out",
    slow: "0.5s ease-in-out",
  },

  // Typography
  typography: {
    fontFamily: {
      base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",   // 12px
      sm: "0.875rem",  // 14px
      base: "1rem",    // 16px
      lg: "1.125rem",  // 18px
      xl: "1.25rem",   // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Card Styles
  card: {
    padding: {
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
    },
    borderRadius: "0.5rem",
    borderWidth: "1px",
    shadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    shadowHover: "0 8px 16px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },

  // Button Styles
  button: {
    padding: {
      sm: "0.25rem 0.5rem",
      md: "0.375rem 0.75rem",
      lg: "0.5rem 1rem",
    },
    borderRadius: "0.375rem",
    fontSize: {
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
    },
    fontWeight: 500,
    transition: "all 0.15s ease-in-out",
  },

  // Badge Styles
  badge: {
    padding: {
      sm: "0.25rem 0.5rem",
      md: "0.35rem 0.65rem",
    },
    borderRadius: "0.25rem",
    fontSize: {
      sm: "0.75rem",
      md: "0.875rem",
    },
    fontWeight: 500,
  },
} as const;

export type Theme = typeof theme;

