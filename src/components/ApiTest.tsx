import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const ApiTest = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const runApiTest = async () => {
    setLoading(true);
    const results: Record<string, any> = {};

    // Test basic connectivity first
    try {
      console.log("Testing basic connectivity...");
      const response = await fetch("/api");
      results.connectivity = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
      };
      console.log("Connectivity result:", results.connectivity);
    } catch (error) {
      results.connectivity = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      console.error("Connectivity error:", error);
    }

    // Test if MMM-Remote-Control is running on the expected port
    try {
      console.log("Testing direct connection to MMM-Remote-Control...");
      const response = await fetch("http://192.168.1.80:8080/api");
      results.direct_connection = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
      };
      console.log("Direct connection result:", results.direct_connection);
    } catch (error) {
      results.direct_connection = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      console.error("Direct connection error:", error);
    }

    // Test actual MMM-Remote-Control endpoints
    const endpointsToTest = [
      { name: "test", url: "/api/test" },
      { name: "config", url: "/api/config" },
      { name: "modules_installed", url: "/api/module/installed" },
      { name: "modules_available", url: "/api/module/available" },
      { name: "brightness", url: "/api/brightness/50" },
      { name: "restart", url: "/api/restart" },
      { name: "reboot", url: "/api/reboot" },
      { name: "refresh", url: "/api/refresh" },
      { name: "monitor_on", url: "/api/monitor/on" },
      { name: "monitor_off", url: "/api/monitor/off" },
      { name: "shutdown", url: "/api/shutdown" },
      { name: "minimize", url: "/api/minimize" },
      { name: "togglefullscreen", url: "/api/togglefullscreen" },
      { name: "devtools", url: "/api/devtools" },
      { name: "save", url: "/api/save" },
      { name: "saves", url: "/api/saves" },
      { name: "translations", url: "/api/translations" },
      // Test module visibility endpoints
      { name: "module_show", url: "/api/module/MMM-newsfeed/show" },
      { name: "module_hide", url: "/api/module/MMM-newsfeed/hide" },
      { name: "module_show_alt", url: "/api/module/MMM-clock/show" },
      { name: "module_hide_alt", url: "/api/module/MMM-clock/hide" },
      // Try root endpoints
      { name: "root", url: "/api/" },
      { name: "docs", url: "/api/docs" },
    ];

    for (const endpoint of endpointsToTest) {
      try {
        console.log(`Testing ${endpoint.name} endpoint: ${endpoint.url}`);
        const response = await fetch(endpoint.url);
        const data = await response.text();

        results[endpoint.name] = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: data.substring(0, 500) + (data.length > 500 ? "..." : ""),
        };
        console.log(`${endpoint.name} result:`, results[endpoint.name]);
      } catch (error) {
        results[endpoint.name] = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        console.error(`${endpoint.name} error:`, error);
      }
    }

    // Test with different HTTP methods
    try {
      console.log("Testing POST method...");
      const response = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.text();
      results.post_test = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data.substring(0, 200) + (data.length > 200 ? "..." : ""),
      };
    } catch (error) {
      results.post_test = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Test
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Test the MMM-Remote-Control API integration
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Development Mode:</strong> Uses Vite proxy to bypass CORS.
          <br />
          <strong>Production:</strong> Requires proper CORS configuration in
          MMM-Remote-Control.
        </Typography>
      </Alert>

      <Button
        variant="contained"
        onClick={runApiTest}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? "Testing..." : "Run API Test"}
      </Button>

      {Object.keys(testResults).length > 0 && (
        <Box sx={{ mt: 3 }}>
          {Object.entries(testResults).map(([endpoint, result]) => (
            <Card key={endpoint} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {endpoint.toUpperCase()} Endpoint
                </Typography>
                {result.success ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Success! Status: {result.status}
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Error:{" "}
                    {result.error ||
                      `Status ${result.status}: ${result.statusText}`}
                  </Alert>
                )}
                {result.data && (
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      backgroundColor: "grey.100",
                      p: 1,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      overflow: "auto",
                      maxHeight: 200,
                    }}
                  >
                    {result.data}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
