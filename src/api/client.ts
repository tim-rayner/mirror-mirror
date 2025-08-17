// MMM-Remote-Control API client
// Base URL should be configurable via environment variable

const API_BASE_URL =
  import.meta.env.VITE_MIRROR_API_URL || "http://192.168.1.80:8080";

export interface Module {
  identifier: string;
  name: string;
  longname?: string;
  desc?: string;
  hidden?: boolean;
  position?: string;
  config?: Record<string, unknown>;
}

export type ActiveModule = {
  name: string;
  longname?: string;
  identifier?: string;
  hidden?: boolean;
  desc?: string;
};

export interface SystemInfo {
  success: boolean;
  data?: {
    brightness?: number;
    uptime?: number;
    version?: string;
    platform?: string;
    nodeVersion?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiError extends Error {
  public status: number;
  public response?: unknown;

  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // Build headers in a CORS-friendly way:
    //  - Do NOT set Content-Type for GET/HEAD so the request remains a "simple request" and avoids a preflight.
    //  - For POST/PUT/PATCH with a body, set Content-Type to application/json.
    const method = (options.method || "GET").toUpperCase();
    const isSimpleRequest = method === "GET" || method === "HEAD";

    const mergedHeaders: HeadersInit = {
      Accept: "application/json",
      // Only set Content-Type for non-simple requests (i.e., when we send a body)
      ...(isSimpleRequest ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      // Keep CORS mode enabled so the browser enforces it properly
      mode: "cors",
      credentials: "omit",
      ...options,
      headers: mergedHeaders,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Check if it's a CORS error
    if (error instanceof TypeError && error.message.includes("CORS")) {
      throw new ApiError(
        `CORS error: The Magic Mirror API is not accessible. Please check your MMM-Remote-Control configuration.`,
        0
      );
    }

    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      0
    );
  }
}

// MMM-Remote-Control API client based on official documentation
export const mirrorApi = {
  // Mirror Control - Test API
  testApi: (): Promise<ApiResponse<string>> =>
    apiRequest<ApiResponse<string>>("/api/test"),

  // Mirror Control - Configuration
  getConfig: (): Promise<ApiResponse<unknown>> =>
    apiRequest<ApiResponse<unknown>>("/api/config"),

  saveConfig: (config: unknown): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/config/edit", {
      method: "POST",
      body: JSON.stringify(config),
    }),

  getConfigBackups: (): Promise<ApiResponse<unknown>> =>
    apiRequest<ApiResponse<unknown>>("/api/saves"),

  saveDefaults: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/save"),

  // Mirror Control - Monitor Control
  turnMonitorOn: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/monitor/on"),

  turnMonitorOff: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/monitor/off"),

  // Mirror Control - System Actions
  shutdown: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/shutdown"),

  reboot: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/reboot"),

  restart: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/restart"),

  minimize: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/minimize"),

  toggleFullscreen: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/togglefullscreen"),

  toggleDevTools: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/devtools"),

  refresh: (): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/refresh"),

  // Mirror Control - Brightness
  setBrightness: (brightness: number): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/brightness/${brightness}`),

  // Mirror Control - Translations
  getTranslations: (): Promise<ApiResponse<unknown>> =>
    apiRequest<ApiResponse<unknown>>("/api/translations"),

  // Module Control - Classes
  useClass: (value: string): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/classes/${value}`),

  // Module Control - User Presence
  setUserPresence: (value: string): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/userpresence/${value}`),

  // Module Control - Module Management
  getModuleActions: (moduleName: string): Promise<ApiResponse<unknown>> =>
    apiRequest<ApiResponse<unknown>>(`/api/module/${moduleName}`),

  executeModuleAction: (
    moduleName: string,
    action: string
  ): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/module/${moduleName}/${action}`),

  getInstalledModules: (): Promise<ApiResponse<Module[]>> =>
    apiRequest<ApiResponse<Module[]>>("/api/module/installed"),

  getAvailableModules: (): Promise<ApiResponse<Module[]>> =>
    apiRequest<ApiResponse<Module[]>>("/api/module/available"),

  getActiveModules: async (): Promise<
    { success: true; data: ActiveModule[] } | { success: false }
  > => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/module`);
      if (!res.ok) return { success: false as const };
      const body = await res.json();
      return {
        success: body?.success === true,
        data: body?.data as ActiveModule[],
      };
    } catch {
      return { success: false as const };
    }
  },

  // Module visibility control
  hideModule: (moduleName: string): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/module/${moduleName}/hide`),

  showModule: (moduleName: string): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/module/${moduleName}/show`),

  updateModule: (moduleName: string): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/update/${moduleName}`),

  installModule: (moduleData: unknown): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>("/api/install", {
      method: "POST",
      body: JSON.stringify(moduleData),
    }),

  // Notifications
  sendNotification: (
    notification: string,
    payload?: string
  ): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(
      `/api/notification/${notification}${payload ? `/${payload}` : ""}`
    ),

  // Commands
  executeCommand: (value: string): Promise<ApiResponse<void>> =>
    apiRequest<ApiResponse<void>>(`/api/command/${value}`),
};
