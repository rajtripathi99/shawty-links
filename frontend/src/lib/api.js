const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const data = await res.json();
  return data;
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
};
