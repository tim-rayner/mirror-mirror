/**
 * Module Name Utilities
 *
 * Helper functions for normalizing module names for UI display
 */

/**
 * Normalize a module name for UI display
 * - Removes "MMM-" prefix
 * - Adds spaces before capital letters (camelCase to spaces)
 * - Trims whitespace
 * - Special case mappings for specific modules
 *
 * Examples:
 * - "MMM-ThisModule" → "This Module"
 * - "MMM-AccuWeatherForecastDeluxe" → "Weather"
 * - "MMM-API" → "API"
 * - "SomeOtherModule" → "Some Other Module"
 */
export const normalizeModuleName = (moduleName: string): string => {
  // Special case mappings
  const specialCases: Record<string, string> = {
    "MMM-AccuWeatherForecastDeluxe": "Weather",
    clock: "Clock",
    newsfeed: "News",
    compliments: "Compliments",
  };

  // Check for special cases first
  if (specialCases[moduleName]) {
    return specialCases[moduleName];
  }

  // Remove MMM- prefix if present
  const withoutPrefix = moduleName.replace(/^MMM-/, "");

  // Add spaces before capital letters (but not at the start)
  const withSpaces = withoutPrefix.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Trim whitespace
  return withSpaces.trim();
};

/**
 * Check if a module name has the MMM- prefix
 */
export const hasMMMPrefix = (moduleName: string): boolean => {
  return moduleName.startsWith("MMM-");
};

/**
 * Get the base name without MMM- prefix
 */
export const getBaseModuleName = (moduleName: string): string => {
  return moduleName.replace(/^MMM-/, "");
};
