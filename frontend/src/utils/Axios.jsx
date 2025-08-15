  import axios from "axios";

  const token = localStorage.getItem("user"); // or whatever key stores your token
console.log(import.meta.env.VITE_API_URL);
  export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    timeout: 10000,
  });



  api.interceptors.request.use(
    (config) => {
      // const token = localStorage.getItem("user");
      console.log(token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // // Add request interceptor for dynamic token
  // api.interceptors.request.use(
  //   config => {
  //   if (token) {
  //     config.headers.authorization = `Bearer ${token}`;
  //   }
  //   return config;
  //   },
  //   error => {
  //     console.log("Request error", error)
  //     return Promise.reject(error);
  //   }
  // );
