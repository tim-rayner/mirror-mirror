/**
 * Module Blacklist
 *
 * Modules listed here will be automatically hidden from the UI.
 * This is useful for hiding system modules, deprecated modules, or modules
 * that shouldn't be user-controlled.
 */

export const MODULE_BLACKLIST = [
  // System modules that shouldn't be user-controlled
  "MMM-Remote-Control",
  "MMM-API",
  "MMM-SystemNotification",
  "MMM-Screencast",

  // Deprecated or problematic modules
  // "MMM-OldModuleName",

  // Add more modules to hide as needed
] as const;

/**
 * Check if a module should be hidden from the UI
 */
export const isModuleBlacklisted = (moduleName: string): boolean => {
  return MODULE_BLACKLIST.includes(
    moduleName as (typeof MODULE_BLACKLIST)[number]
  );
};

/**
 * Filter out blacklisted modules from an array
 */
export const filterBlacklistedModules = <T extends { name: string }>(
  modules: T[]
): T[] => {
  return modules.filter((module) => !isModuleBlacklisted(module.name));
};
