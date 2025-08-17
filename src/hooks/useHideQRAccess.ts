import { useEffect } from "react";
import { mirrorApi } from "../api/client";

/**
 * Hook to disable the QRAccess module on app mount
 * This ensures the QR access module is completely turned off
 */
export const useDisableQRAccess = () => {
  useEffect(() => {
    const disableQRAccess = async () => {
      try {
        // First try to get available actions for the module
        try {
          const moduleActions = await mirrorApi.getModuleActions(
            "MMM-QRAccess"
          );
          console.log("Available actions for MMM-QRAccess:", moduleActions);
        } catch (actionsError) {
          console.log("Could not get module actions for MMM-QRAccess");
        }

        // Then try to disable it using common disable actions
        const disableActions = ["disable", "stop", "turnOff", "deactivate"];

        for (const action of disableActions) {
          try {
            await mirrorApi.executeModuleAction("MMM-QRAccess", action);
            console.log(`MMM-QRAccess module ${action}d successfully`);
            break; // Stop trying other actions if one succeeds
          } catch (actionError) {
            // Continue to next action if this one fails
            console.log(
              `Action '${action}' not available for MMM-QRAccess module`
            );
          }
        }

        // Also try to hide it as a fallback
        try {
          await mirrorApi.hideModule("MMM-QRAccess");
          console.log("MMM-QRAccess module hidden successfully");
        } catch (hideError) {
          console.log("Could not hide MMM-QRAccess module");
        }
      } catch (error) {
        console.error("Failed to disable MMM-QRAccess module:", error);
        // Don't throw error to prevent app from crashing
      }
    };

    disableQRAccess();
  }, []); // Empty dependency array ensures this runs only once on mount
};
