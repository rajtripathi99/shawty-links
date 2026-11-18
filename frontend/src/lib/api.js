const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const linksStreamUrl = `${API_BASE}/links/stream`;

// Render's free tier sleeps when idle; the first request can take ~30-60s to
// wake it. Fail with a clear message instead of hanging forever.
const REQUEST_TIMEOUT_MS = 20000;

const request = async (endpoint, options = {}) => {
  let res;

  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: "include",
      ...options,
      signal: options.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    const timedOut = error.name === "TimeoutError";

    return {
      success: false,
      message: timedOut
        ? "The server is taking too long to respond. It may be waking up — please try again."
        : "Network error. Please try again.",
      data: null,
    };
  }

  try {
    return await res.json();
  } catch {
    return {
      success: false,
      message: res.ok ? "Unexpected server response" : `Server error (${res.status})`,
      data: null,
    };
  }
};

export const api = {
  register: (email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request("/auth/logout", { method: "POST" }),

  getMe: () =>
    request("/auth/me"),

  createLink: (url) =>
    request("/links", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),

  getMyLinks: () =>
    request("/links/my"),

  getOriginalUrl: (shortCode) =>
    request(`/links/${encodeURIComponent(shortCode)}`),
};
