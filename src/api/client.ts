// MMM-Remote-Control API client (same-origin via Nginx proxy)
// Nginx should proxy /api/* to http://127.0.0.1:8080 and inject the API key.
// Your React app should call relative URLs (no hardcoded host/port).

// If you *really* want to override (e.g., during local dev), set VITE_MIRROR_API_URL
// to a relative path ('' or '/') or to a same-origin subpath. Default is '' (same origin).
const RAW_BASE = (import.meta.env.VITE_MIRROR_API_URL ?? "").trim();
const API_BASE_URL = RAW_BASE === "/" ? "" : RAW_BASE; // normalize

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

function buildUrl(endpoint: string): string {
  // Ensure endpoint starts with "/"
  const ep = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // When API_BASE_URL is "", fetch() uses same-origin
  return `${API_BASE_URL}${ep}`;
}

async function apiRequest<TResp>(
  endpoint: string,
  options: RequestInit = {}
): Promise<TResp> {
  const method = (options.method || "GET").toUpperCase();
  const isSimple = method === "GET" || method === "HEAD";

  // IMPORTANT: no Authorization/API key header here.
  // Nginx injects "Authorization: apiKey <KEY>" when proxying to MMM.
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(isSimple ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const res = await fetch(buildUrl(endpoint), {
    // default mode is "cors" only for cross-origin; for relative URLs this is same-origin
    // don't force credentials; not needed for this API
    ...options,
    headers,
  });

  if (!res.ok) {
    // Try to parse JSON error if available
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    throw new ApiError(`API ${res.status} ${res.statusText}`, res.status, body);
  }

  // Endpoints return JSON
  return (await res.json()) as TResp;
}

// MMM-Remote-Control API (same-origin)
export const mirrorApi = {
  // Basic checks
  testApi: () => apiRequest<ApiResponse<string>>("/api/test"),
  getConfig: () => apiRequest<ApiResponse<unknown>>("/api/config"),
  saveConfig: (config: unknown) =>
    apiRequest<ApiResponse<void>>("/api/config/edit", {
      method: "POST",
      body: JSON.stringify(config),
    }),
  getConfigBackups: () => apiRequest<ApiResponse<unknown>>("/api/saves"),
  saveDefaults: () => apiRequest<ApiResponse<void>>("/api/save"),

  // Monitor
  turnMonitorOn: () => apiRequest<ApiResponse<void>>("/api/monitor/on"),
  turnMonitorOff: () => apiRequest<ApiResponse<void>>("/api/monitor/off"),

  // System
  shutdown: () => apiRequest<ApiResponse<void>>("/api/shutdown"),
  reboot: () => apiRequest<ApiResponse<void>>("/api/reboot"),
  restart: () => apiRequest<ApiResponse<void>>("/api/restart"),
  minimize: () => apiRequest<ApiResponse<void>>("/api/minimize"),
  toggleFullscreen: () =>
    apiRequest<ApiResponse<void>>("/api/togglefullscreen"),
  toggleDevTools: () => apiRequest<ApiResponse<void>>("/api/devtools"),
  refresh: () => apiRequest<ApiResponse<void>>("/api/refresh"),

  // Brightness
  setBrightness: (brightness: number) =>
    apiRequest<ApiResponse<void>>(`/api/brightness/${brightness}`),

  // Translations
  getTranslations: () => apiRequest<ApiResponse<unknown>>("/api/translations"),

  // Classes
  useClass: (value: string) =>
    apiRequest<ApiResponse<void>>(`/api/classes/${value}`),

  // User presence
  setUserPresence: (value: string) =>
    apiRequest<ApiResponse<void>>(`/api/userpresence/${value}`),

  // Module actions
  getModuleActions: (moduleName: string) =>
    apiRequest<ApiResponse<unknown>>(
      `/api/module/${encodeURIComponent(moduleName)}`
    ),

  executeModuleAction: (moduleName: string, action: string) =>
    apiRequest<ApiResponse<void>>(
      `/api/module/${encodeURIComponent(moduleName)}/${encodeURIComponent(
        action
      )}`
    ),

  // Installed/available (filesystem)
  getInstalledModules: () =>
    apiRequest<ApiResponse<Module[]>>("/api/module/installed"),
  getAvailableModules: () =>
    apiRequest<ApiResponse<Module[]>>("/api/module/available"),

  // Active modules (runtime)
  getActiveModules: async () => {
    const body = await apiRequest<ApiResponse<ActiveModule[]>>("/api/module"); // singular
    return body;
  },

  // Visibility
  hideModule: (moduleName: string) =>
    apiRequest<ApiResponse<void>>(
      `/api/module/${encodeURIComponent(moduleName)}/hide`
    ),
  showModule: (moduleName: string) =>
    apiRequest<ApiResponse<void>>(
      `/api/module/${encodeURIComponent(moduleName)}/show`
    ),

  // Update/install
  updateModule: (moduleName: string) =>
    apiRequest<ApiResponse<void>>(
      `/api/update/${encodeURIComponent(moduleName)}`
    ),
  installModule: (moduleData: unknown) =>
    apiRequest<ApiResponse<void>>("/api/install", {
      method: "POST",
      body: JSON.stringify(moduleData),
    }),

  // Notifications & commands
  sendNotification: (notification: string, payload?: string) =>
    apiRequest<ApiResponse<void>>(
      `/api/notification/${encodeURIComponent(notification)}${
        payload ? `/${encodeURIComponent(payload)}` : ""
      }`
    ),

  executeCommand: (value: string) =>
    apiRequest<ApiResponse<void>>(`/api/command/${encodeURIComponent(value)}`),
};
