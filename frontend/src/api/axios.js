import axios from "axios";

const API = axios.create({
  baseURL:
    "https://talksy-chat-app-pnk2.onrender.com/api",
  withCredentials: true,
});

// ======================================
// 🔥 REFRESH QUEUE
// ======================================
let isRefreshing = false;

let failedQueue = [];

const processQueue = (
  error,
  success = false
) => {

  failedQueue.forEach((prom) => {

    if (error) {

      prom.reject(error);

    } else {

      prom.resolve(success);
    }
  });

  failedQueue = [];
};

// ======================================
// 🔥 RESPONSE INTERCEPTOR
// ======================================
API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (

      error.response?.status === 401 &&

      !originalRequest._retry &&

      !originalRequest.url.includes(
        "/auth/refresh-token"
      )
    ) {

      // ======================================
      // 🔥 WAIT IF REFRESH RUNNING
      // ======================================
      if (isRefreshing) {

        return new Promise(
          (resolve, reject) => {

            failedQueue.push({
              resolve,
              reject,
            });
          }
        ).then(() => {

          return API(
            originalRequest
          );
        });
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {

        await axios.post(

          "https://talksy-chat-app-pnk2.onrender.com/api/auth/refresh-token",

          {},

          {
            withCredentials: true,
          }
        );

        processQueue(
          null,
          true
        );

        return API(
          originalRequest
        );

      } catch (refreshError) {

        processQueue(
          refreshError,
          false
        );

        localStorage.removeItem(
          "step"
        );

        // 🔥 no full reload
        if (
          window.location.pathname !== "/"
        ) {

          window.dispatchEvent(
            new CustomEvent(
              "session-expired"
            )
          );
        }

        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;