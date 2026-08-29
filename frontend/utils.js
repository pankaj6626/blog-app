const isLocalEnvironment =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (isLocalEnvironment ? "http://localhost:4000" : "https://blog-app-9ifo.onrender.com");
//..