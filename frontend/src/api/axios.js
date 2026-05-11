import axios from "axios";

const API = axios.create({

  baseURL:
    "http://localhost:8080/api",

  withCredentials: true,
});

// 🔥 refresh control
let isRefreshing = false;

// ===============================
// 🔥 RESPONSE INTERCEPTOR
// ===============================
API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // 🔥 ACCESS TOKEN EXPIRED
    if (

      error.response?.status === 401 &&

      !originalRequest._retry &&

      !originalRequest.url.includes(
        "/auth/refresh-token"
      )
    ) {

      originalRequest._retry = true;

      try {

        // ❌ prevent multiple refresh calls
        if (!isRefreshing) {

          isRefreshing = true;

          await axios.post(

            "http://localhost:8080/api/auth/refresh-token",

            {},

            {
              withCredentials: true,
            }
          );

          isRefreshing = false;
        }

        // ✅ retry original request
        return API(originalRequest);

      } catch (refreshError) {

        isRefreshing = false;

        console.log(
          "Refresh token expired"
        );

        // 🔥 CLEAR STORAGE
        localStorage.removeItem(
          "step"
        );

        // 🔥 ONLY ONE REDIRECT
        if (
          window.location.pathname !== "/"
        ) {

          window.location.href = "/";
        }

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default API;