import axios from "axios"

export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ??
      err.message ??
      "Unknown request error"
    return Promise.reject(new Error(message))
  }
)
